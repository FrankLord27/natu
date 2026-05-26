"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function usePagination(initialPage = 1, initialLimit = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || String(initialPage)),
  );
  const [limit] = useState(initialLimit);

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return {
    page,
    limit,
    setPage,
    goToPage,
  };
}
