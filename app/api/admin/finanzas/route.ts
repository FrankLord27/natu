import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  differenceInDays,
} from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // 1. DESCRIPTIVE METRICS (Current Month)
    const [currentMonthOrders, lastMonthOrders, accountingEntries] =
      await Promise.all([
        prisma.order.findMany({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            status: { notIn: ["CANCELLED", "PENDING"] },
          },
          include: { items: true },
        }),
        prisma.order.findMany({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            status: { notIn: ["CANCELLED", "PENDING"] },
          },
        }),
        prisma.accountingEntry.findMany({
          take: 20,
          orderBy: { date: "desc" },
        }),
      ]);

    const currentRevenue = currentMonthOrders.reduce(
      (sum: number, o: any) => sum + (o.total || 0),
      0,
    );
    const currentCost = currentMonthOrders.reduce(
      (sum: number, o: any) =>
        sum +
        (o.items || []).reduce(
          (itemSum: number, item: any) =>
            itemSum + (item.costPrice || 0) * (item.quantity || 0),
          0,
        ),
      0,
    );
    const currentProfit = currentRevenue - currentCost;
    const currentAOV =
      currentMonthOrders.length > 0
        ? currentRevenue / currentMonthOrders.length
        : 0;

    // 2. DIAGNOSTIC METRICS (MoM Analysis)
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum: number, o: any) => sum + (o.total || 0),
      0,
    );
    const momGrowth =
      lastMonthRevenue > 0
        ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // 3. PREDICTIVE METRICS (Month-End Projection)
    const daysPassed = differenceInDays(now, currentMonthStart) + 1;
    const totalDaysInMonth =
      differenceInDays(currentMonthEnd, currentMonthStart) + 1;
    const dailyAverage = currentRevenue / daysPassed;
    const projectedRevenue = dailyAverage * totalDaysInMonth;

    // 4. CHART DATA (Last 30 Days)
    const thirtyDaysAgo = startOfDay(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    );
    const last30DaysOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { notIn: ["CANCELLED"] },
      },
      select: { createdAt: true, total: true },
    });

    const dailyStats = last30DaysOrders.reduce(
      (
        acc: Record<string, number>,
        order: { createdAt: Date; total: number },
      ) => {
        const date = order.createdAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + order.total;
        return acc;
      },
      {},
    );

    const chartData = Object.keys(dailyStats)
      .sort()
      .map((date) => ({ date, total: dailyStats[date] }));

    return NextResponse.json({
      success: true,
      descriptive: {
        revenue: currentRevenue,
        cost: currentCost,
        profit: currentProfit,
        aov: currentAOV,
        orderCount: currentMonthOrders.length,
      },
      diagnostic: {
        lastMonthRevenue,
        momGrowth,
      },
      predictive: {
        projectedRevenue,
        projectedProfit: (currentProfit / daysPassed) * totalDaysInMonth,
      },
      chartData,
      recentEntries: accountingEntries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
