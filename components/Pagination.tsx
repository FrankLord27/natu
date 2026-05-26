"use client";

import React from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
  padding: 20px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : "#eee")};
  background: ${(p) => (p.$active ? p.theme.colors.primary : "white")};
  color: ${(p) => (p.$active ? "white" : "#666")};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => (p.$active ? "white" : p.theme.colors.primary)};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  color: #999;
  padding: 0 5px;
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PageButton
            key={i}
            $active={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PageButton>,
        );
      }
    } else {
      // Logic for many pages
      pages.push(
        <PageButton
          key={1}
          $active={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PageButton>,
      );

      if (currentPage > 3) pages.push(<Ellipsis key="e1">...</Ellipsis>);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PageButton
              key={i}
              $active={currentPage === i}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PageButton>,
          );
        }
      }

      if (currentPage < totalPages - 2)
        pages.push(<Ellipsis key="e2">...</Ellipsis>);

      pages.push(
        <PageButton
          key={totalPages}
          $active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PageButton>,
      );
    }

    return pages;
  };

  return (
    <Container>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={18} />
      </PageButton>

      {renderPageNumbers()}

      <PageButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={18} />
      </PageButton>
    </Container>
  );
};

export default Pagination;
