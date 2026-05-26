"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export const SkeletonBlock = styled.div<{
  $w?: string;
  $h?: number;
  $radius?: number;
}>`
  width: ${(p) => p.$w || "100%"};
  height: ${(p) => p.$h || 14}px;
  border-radius: ${(p) => (p.$radius !== undefined ? p.$radius : 6)}px;
  background: linear-gradient(90deg, #eeeeee 25%, #e2e2e2 50%, #eeeeee 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  flex-shrink: 0;
`;

const GridSkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 100px 80px 120px;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  gap: 10px;
`;

export function ProductGridSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <GridSkeletonRow key={i}>
          <SkeletonBlock $w="50px" $h={50} $radius={10} />
          <div>
            <SkeletonBlock $w="70%" $h={14} style={{ marginBottom: 8 }} />
            <SkeletonBlock $w="40%" $h={12} />
          </div>
          <SkeletonBlock $w="80%" $h={14} />
          <SkeletonBlock $w="60px" $h={14} />
          <SkeletonBlock $w="50px" $h={20} $radius={20} />
          <SkeletonBlock $w="90px" $h={32} $radius={8} />
        </GridSkeletonRow>
      ))}
    </>
  );
}

const widths = ["55%", "75%", "60%", "40%", "55%", "65%"];

export function TableBodySkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td
              key={colIdx}
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <SkeletonBlock $w={widths[colIdx % widths.length]} $h={14} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

const InvoiceCardSkel = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 15px;
  border: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function InvoiceListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <InvoiceCardSkel key={i}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <SkeletonBlock $w="50px" $h={50} $radius={12} />
            <div>
              <SkeletonBlock $w="180px" $h={16} style={{ marginBottom: 10 }} />
              <SkeletonBlock $w="120px" $h={12} />
            </div>
          </div>
          <SkeletonBlock $w="100px" $h={24} $radius={8} />
        </InvoiceCardSkel>
      ))}
    </div>
  );
}

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCardSkel = styled.div`
  background: white;
  padding: 25px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`;

export function MetricsStatsSkeleton() {
  return (
    <StatsRow>
      {Array.from({ length: 4 }).map((_, i) => (
        <MetricCardSkel key={i}>
          <SkeletonBlock $w="60%" $h={12} style={{ marginBottom: 15 }} />
          <SkeletonBlock $w="50%" $h={28} style={{ marginBottom: 12 }} />
          <SkeletonBlock $w="40%" $h={12} />
        </MetricCardSkel>
      ))}
    </StatsRow>
  );
}
