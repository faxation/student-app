import { prisma } from "@/lib/server/db";
import { WarningLevel, EnrollmentStatus } from "@prisma/client";

/**
 * Recompute the AttendanceSummary for a student in a section
 * and enforce the AW rule (7 absences → academic withdrawal).
 */
export async function recomputeAttendanceSummary(
  studentId: string,
  sectionId: string,
  actorId?: string
) {
  const records = await prisma.attendanceRecord.findMany({
    where: {
      studentId,
      session: { sectionId },
    },
  });

  const presentCount = records.filter((r) => r.value === "PRESENT").length;
  const absentCount = records.filter((r) => r.value === "ABSENT").length;

  let warningLevel: WarningLevel = WarningLevel.NONE;
  let isAW = false;

  if (absentCount >= 7) {
    warningLevel = WarningLevel.AW_7;
    isAW = true;
  } else if (absentCount >= 6) {
    warningLevel = WarningLevel.LAST_WARNING_6;
  } else if (absentCount >= 5) {
    warningLevel = WarningLevel.WARNING_5;
  } else if (absentCount >= 4) {
    warningLevel = WarningLevel.WARNING_4;
  }

  await prisma.attendanceSummary.upsert({
    where: {
      studentId_sectionId: { studentId, sectionId },
    },
    create: {
      studentId,
      sectionId,
      presentCount,
      absentCount,
      warningLevel,
      isAcademicallyWithdrawn: isAW,
    },
    update: {
      presentCount,
      absentCount,
      warningLevel,
      isAcademicallyWithdrawn: isAW,
    },
  });

  // If AW triggered, update enrollment status
  if (isAW) {
    await prisma.sectionEnrollment.updateMany({
      where: {
        studentId,
        sectionId,
        status: EnrollmentStatus.ENROLLED,
      },
      data: {
        status: EnrollmentStatus.ACADEMICALLY_WITHDRAWN,
        withdrawnAt: new Date(),
      },
    });

    // Create notification
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.userId,
          type: "ACADEMIC_WITHDRAWAL",
          title: "Academic Withdrawal",
          body: "You have been academically withdrawn due to excessive absences (7+).",
          entityType: "SectionEnrollment",
          entityId: sectionId,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId,
        entityType: "SectionEnrollment",
        entityId: `${studentId}-${sectionId}`,
        action: "ACADEMIC_WITHDRAWAL",
        newValues: { absentCount, warningLevel: "AW_7" },
      },
    });
  }

  return { presentCount, absentCount, warningLevel, isAW };
}
