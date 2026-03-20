import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_FINANCE } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
    const account = await prisma.studentFinanceAccount.findUnique({
      where: { studentId: sp.id },
      include: {
        ledgerEntries: {
          include: { term: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!account) {
      return NextResponse.json(DEV_STUDENT_FINANCE);
    }

    const lbpEntries = account.ledgerEntries.filter(e => e.currency === "LBP");
    const usdEntries = account.ledgerEntries.filter(e => e.currency === "USD");

    const totalLbpRemaining = lbpEntries
      .filter(e => e.status !== "PAID" && e.status !== "WAIVED")
      .reduce((s, e) => s + Number(e.amount), 0);
    const totalUsdRemaining = usdEntries
      .filter(e => e.status !== "PAID" && e.status !== "WAIVED")
      .reduce((s, e) => s + Number(e.amount), 0);

    return NextResponse.json({
      account: { balanceUsd: totalUsdRemaining, balanceLbp: totalLbpRemaining, currency: "USD" },
      entries: account.ledgerEntries.map(e => ({
        id: e.id,
        term: e.term?.name ?? "",
        type: e.entryType,
        description: e.description,
        amount: Number(e.amount),
        currency: e.currency,
        status: e.status,
        dueDate: e.dueDate?.toISOString().split("T")[0] ?? null,
        paidAt: e.paidAt?.toISOString().split("T")[0] ?? null,
      })),
      totalLbpRemaining,
      totalUsdRemaining,
      lbpFees: [],
      usdFees: [],
      studentProfile: {
        program: sp.program ?? "",
        faculty: sp.faculty ?? "",
        advisor: "",
        gpa: sp.gpa ? Number(sp.gpa) : 0,
        creditsCompleted: sp.creditsCompleted ?? 0,
        creditsRequired: sp.creditsRequired ?? 0,
      },
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_FINANCE);
  }
}
