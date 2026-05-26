"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Grid,
  List,
  ChevronDown,
  Star,
  Layout as LayoutIcon,
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

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  @media (max-width: ${(p) => p.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: ${(p) => p.theme.breakpoints.lg}) {
    display: none;
    &.$mobile-open {
      display: block;
    }
  }
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 25px;

  h4 {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 18px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const RangeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1.5px solid #eee;
    font-size: 0.85rem;
  }
`;

const RatingFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#666")};
  transition: all 0.2s;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
  .stars {
    display: flex;
    gap: 2px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #eee;
  padding: 4px;
  border-radius: 10px;
`;

const ViewBtn = styled.button<{ $active: boolean }>`
  padding: 6px 10px;
  border-radius: 8px;
  background: ${(p) => (p.$active ? "white" : "transparent")};
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#999")};
  box-shadow: ${(p) => (p.$active ? "0 2px 6px rgba(0,0,0,0.1)" : "none")};
  transition: all 0.3s;
`;

const HeroBanner = styled.section`
  padding: 60px 5%;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primaryPale} 0%,
    #f8faf5 100%
  );
  text-align: center;
  h1 {
    font-size: 2.8rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.text};
    margin-bottom: 10px;
    @media (max-width: ${(p) => p.theme.breakpoints.md}) {
      font-size: 2rem;
    }
  }
  p {
    color: ${(p) => p.theme.colors.textLight};
    font-size: 1.1rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 5%;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  flex-wrap: wrap;
  gap: 15px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: 14px;
  padding: 0 16px;
  flex: 1;
  max-width: 400px;
  transition: border-color 0.3s;
  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
  }
  input {
    border: none;
    outline: none;
    padding: 14px 8px;
    flex: 1;
    font-size: 0.95rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SortSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: white;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 22px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: left;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "white"};
  color: ${({ $active }) => ($active ? "white" : "#666")};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "#e0e0e0")};
  transition: all 0.3s ease;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${({ $active, theme }) =>
      $active ? "white" : theme.colors.primary};
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

const ProductGrid = styled.div<{ $view: "grid" | "list" }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$view === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr"};
  gap: 30px;
`;

export default function Tienda() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState<any>(null);

  const sortOptions = [
    { value: "newest", label: "Nuevos" },
    { value: "price-asc", label: "Precio Bajo" },
    { value: "price-desc", label: "Precio Alto" },
    { value: "rating", label: "Rating" },
  ];

  const limitOptions = [
    { value: "12", label: "12 por página" },
    { value: "24", label: "24 por página" },
    { value: "48", label: "48 por página" },
  ];

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

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
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setSelectedCategory(cat);
  }, []);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSelectedCategory("Todos");
    setSearch("");
    setPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, minPrice, maxPrice, minRating, sort, limit]);

  return (
    <Page>
      <HeroBanner>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nuestra Tienda
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          El poder de la naturaleza en tus manos
        </motion.p>
      </HeroBanner>

      <Container>
        <Layout>
          <Sidebar>
            <FilterSection>
              <h4>
                <Filter size={18} /> Categorías
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Tab
                  $active={selectedCategory === "Todos"}
                  onClick={() => setSelectedCategory("Todos")}
                >
                  Todos
                </Tab>
                {categories.map((cat) => (
                  <Tab
                    key={cat.id}
                    $active={selectedCategory === cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}{" "}
                    {cat._count && (
                      <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
                        ({cat._count.products})
                      </span>
                    )}
                  </Tab>
                ))}
              </div>
            </FilterSection>

            <FilterSection>
              <h4>
                <SlidersHorizontal size={18} /> Rango de Precio
              </h4>
              <RangeInput>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </RangeInput>
            </FilterSection>

            <FilterSection>
              <h4>
                <Star size={18} /> Calificación
              </h4>
              <RatingFilter>
                {[4, 3, 2].map((r) => (
                  <RatingBtn
                    key={r}
                    $active={minRating === r}
                    onClick={() => setMinRating(minRating === r ? 0 : r)}
                  >
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < r ? "#FFB800" : "none"}
                          color="#FFB800"
                        />
                      ))}
                    </div>
                    o más
                  </RatingBtn>
                ))}
              </RatingFilter>
            </FilterSection>

            <button
              onClick={clearFilters}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#f0f0f0",
                fontWeight: 700,
                color: "#666",
                marginTop: 20,
              }}
            >
              Limpiar Filtros
            </button>
          </Sidebar>

          <div>
            <TopBar>
              <SearchBox>
                <Search size={18} color="#999" />
                <input
                  placeholder="Busca cremas, aceites, jabones..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={16} />
                  </button>
                )}
              </SearchBox>

              <Controls>
                <ViewToggle>
                  <ViewBtn
                    $active={view === "grid"}
                    onClick={() => setView("grid")}
                  >
                    <Grid size={18} />
                  </ViewBtn>
                  <ViewBtn
                    $active={view === "list"}
                    onClick={() => setView("list")}
                  >
                    <List size={18} />
                  </ViewBtn>
                </ViewToggle>

                <CustomDropdown
                  options={sortOptions}
                  value={sort}
                  onChange={setSort}
                  width="180px"
                />

                <CustomDropdown
                  options={limitOptions}
                  value={limit.toString()}
                  onChange={(val) => setLimit(parseInt(val))}
                  width="160px"
                />
              </Controls>
            </TopBar>

            {loading ? (
              <ProductGrid $view={view}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 350,
                      background: "#eee",
                      borderRadius: 20,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                ))}
              </ProductGrid>
            ) : products.length === 0 ? (
              <EmptyState>
                <h3>Oops! No hay resultados</h3>
                <p>Intenta ajustar tus filtros para encontrar lo que buscas.</p>
                <br />
                <button
                  onClick={clearFilters}
                  style={{ color: "#314e32", fontWeight: 700 }}
                >
                  Ver todo
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

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </Layout>
      </Container>
    </Page>
  );
}
