"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Star,
  ChevronDown,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/actions";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductListCard } from "@/components/products/ProductListCard";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import Pagination from "@/components/Pagination";
import { Product, Category } from "@/types";

const Page = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const HeroBanner = styled.section`
  padding: 50px 5%;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primaryPale} 0%,
    #f8faf5 100%
  );
  text-align: center;
  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.text};
    margin-bottom: 8px;
    @media (max-width: ${(p) => p.theme.breakpoints.md}) {
      font-size: 1.8rem;
    }
  }
  p {
    color: ${(p) => p.theme.colors.textLight};
    font-size: 1rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 5%;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 0 14px;
  flex: 1;
  min-width: 200px;
  transition: border-color 0.3s;
  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
  }
  input {
    border: none;
    outline: none;
    padding: 12px 8px;
    flex: 1;
    font-size: 0.9rem;
    background: transparent;
  }
`;

const FilterToggle = styled.button<{ $active: boolean; $count: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 2px solid
    ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.primaryPale : "white")};
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#666")};
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.2s;
  position: relative;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
  }
  ${(p) =>
    p.$count > 0 &&
    `
    &::after {
      content: "${p.$count}";
      position: absolute;
      top: -8px;
      right: -8px;
      background: ${p.theme.colors.primary};
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}
`;

const ViewToggle = styled.div`
  display: flex;
  background: white;
  border: 2px solid ${(p) => p.theme.colors.border};
  padding: 3px;
  border-radius: 10px;
`;

const ViewBtn = styled.button<{ $active: boolean }>`
  padding: 6px 10px;
  border-radius: 7px;
  background: ${(p) =>
    p.$active ? p.theme.colors.primaryPale : "transparent"};
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#999")};
  transition: all 0.2s;
`;

const FiltersPanel = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterGroup = styled.div`
  h4 {
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #999;
    margin-bottom: 10px;
  }
`;

const CategoryChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button<{ $active: boolean }>`
  padding: 7px 16px;
  border-radius: 20px;
  border: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : "#e8e8e8")};
  background: ${(p) => (p.$active ? p.theme.colors.primaryPale : "white")};
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#555")};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  input {
    width: 90px;
    padding: 8px 12px;
    border-radius: 8px;
    border: 2px solid #e8e8e8;
    font-size: 0.85rem;
    &:focus {
      outline: none;
      border-color: ${(p) => p.theme.colors.primary};
    }
  }
  span {
    color: #999;
    font-weight: 600;
  }
`;

const RatingChips = styled.div`
  display: flex;
  gap: 8px;
`;

const RatingChip = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 20px;
  border: 2px solid ${(p) => (p.$active ? "#FFB800" : "#e8e8e8")};
  background: ${(p) => (p.$active ? "#FFF8E1" : "white")};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? "#E65100" : "#666")};
  cursor: pointer;
  transition: all 0.2s;
`;

const ClearBtn = styled.button`
  font-size: 0.85rem;
  font-weight: 700;
  color: #999;
  text-decoration: underline;
  align-self: center;
  &:hover {
    color: #333;
  }
`;

const ResultsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
`;

const ProductGrid = styled.div<{ $view: "grid" | "list" }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$view === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr"};
  gap: 24px;
`;

const SkeletonCard = styled.div`
  height: 340px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 0;
  color: ${(p) => p.theme.colors.textMuted};
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #999;
  }
  p {
    font-size: 1rem;
  }
`;

export default function Tienda() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [pagination, setPagination] = useState<any>(null);

  const sortOptions = [
    { value: "newest", label: "Más nuevos" },
    { value: "price-asc", label: "Precio: menor a mayor" },
    { value: "price-desc", label: "Precio: mayor a menor" },
    { value: "rating", label: "Mejor valorados" },
  ];

  const activeFiltersCount =
    (selectedCategory !== "Todos" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const result = await getProducts({
      query: search || undefined,
      category: selectedCategory !== "Todos" ? selectedCategory : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating || undefined,
      sort,
      page,
      limit,
    });
    if (result.success) {
      setProducts(result.data as Product[]);
      setPagination(result.pagination);
    }
    setLoading(false);
  }, [
    search,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
    minRating,
    page,
    limit,
  ]);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data as Category[]);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setSelectedCategory(cat);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, minPrice, maxPrice, minRating, sort]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSelectedCategory("Todos");
    setSearch("");
    setPage(1);
  };

  return (
    <Page>
      <HeroBanner>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nuestra Tienda
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          El poder de la naturaleza en tus manos
        </motion.p>
      </HeroBanner>

      <Container>
        {/* Top Controls */}
        <ControlsBar>
          <SearchBox>
            <Search size={16} color="#999" />
            <input
              placeholder="Busca productos naturales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={15} color="#999" />
              </button>
            )}
          </SearchBox>

          <FilterToggle
            $active={showFilters}
            $count={activeFiltersCount}
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={16} />
            Filtros
            <ChevronDown
              size={14}
              style={{
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </FilterToggle>

          <CustomDropdown
            options={sortOptions}
            value={sort}
            onChange={setSort}
            width="210px"
          />

          <ViewToggle>
            <ViewBtn $active={view === "grid"} onClick={() => setView("grid")}>
              <Grid size={16} />
            </ViewBtn>
            <ViewBtn $active={view === "list"} onClick={() => setView("list")}>
              <List size={16} />
            </ViewBtn>
          </ViewToggle>
        </ControlsBar>

        {/* Collapsible Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <FiltersPanel
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
            >
              <FilterGroup>
                <h4>Categoría</h4>
                <CategoryChips>
                  <Chip
                    $active={selectedCategory === "Todos"}
                    onClick={() => setSelectedCategory("Todos")}
                  >
                    Todos
                  </Chip>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      $active={selectedCategory === cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      {cat.name}
                      {cat._count && (
                        <span
                          style={{
                            opacity: 0.6,
                            marginLeft: 4,
                            fontSize: "0.75rem",
                          }}
                        >
                          ({cat._count.products})
                        </span>
                      )}
                    </Chip>
                  ))}
                </CategoryChips>
              </FilterGroup>

              <FilterRow>
                <FilterGroup>
                  <h4>Rango de precio</h4>
                  <PriceInputs>
                    <input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </PriceInputs>
                </FilterGroup>

                <FilterGroup>
                  <h4>Calificación mínima</h4>
                  <RatingChips>
                    {[4, 3, 2].map((r) => (
                      <RatingChip
                        key={r}
                        $active={minRating === r}
                        onClick={() => setMinRating(minRating === r ? 0 : r)}
                      >
                        {[...Array(r)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill="#FFB800"
                            color="#FFB800"
                          />
                        ))}
                        +
                      </RatingChip>
                    ))}
                  </RatingChips>
                </FilterGroup>

                {activeFiltersCount > 0 && (
                  <ClearBtn onClick={clearFilters}>Limpiar todo</ClearBtn>
                )}
              </FilterRow>
            </FiltersPanel>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <ResultsBar>
          <span>
            {loading
              ? "Buscando..."
              : pagination
                ? `${pagination.total} producto${pagination.total !== 1 ? "s" : ""} encontrado${pagination.total !== 1 ? "s" : ""}`
                : `${products.length} producto${products.length !== 1 ? "s" : ""}`}
          </span>
          {pagination && pagination.totalPages > 1 && (
            <span>
              Página {page} de {pagination.totalPages}
            </span>
          )}
        </ResultsBar>

        {/* Product Grid */}
        {loading ? (
          <ProductGrid $view={view}>
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </ProductGrid>
        ) : products.length === 0 ? (
          <EmptyState>
            <h3>Sin resultados</h3>
            <p>Intenta ajustar los filtros o buscar algo diferente.</p>
            <br />
            <button
              onClick={clearFilters}
              style={{
                color: "#314e32",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              Ver todos los productos
            </button>
          </EmptyState>
        ) : (
          <ProductGrid $view={view}>
            {products.map((p) =>
              view === "grid" ? (
                <ProductCard key={p.id} product={p} />
              ) : (
                <ProductListCard key={p.id} product={p} />
              ),
            )}
          </ProductGrid>
        )}

        {/* Pagination — always shown when there's more than 1 page */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </Container>
    </Page>
  );
}
