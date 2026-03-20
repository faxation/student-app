import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

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
    return NextResponse.json({ entries: [], summary: { totalLbpRemaining: 0, totalUsdRemaining: 0 } });
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
    summary: { totalLbpRemaining, totalUsdRemaining },
  });
}
