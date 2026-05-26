# Code Patterns & Best Practices 🎨

Patrones de código probados y optimizados para desarrollo e-commerce.

## 🧩 Component Patterns

### 1. Compound Components Pattern

Cuando un componente tiene partes relacionadas que trabajan juntas:

```typescript
// components/Accordion/index.tsx
import { createContext, useContext, useState } from 'react'
import styled from 'styled-components'

// Context para compartir estado
const AccordionContext = createContext<{
  openIndex: number | null
  setOpenIndex: (index: number | null) => void
}>({ openIndex: null, setOpenIndex: () => {} })

// Componente principal
export function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <Container>{children}</Container>
    </AccordionContext.Provider>
  )
}

// Sub-componente Item
function AccordionItem({
  index,
  children
}: {
  index: number
  children: React.ReactNode
}) {
  const { openIndex } = useContext(AccordionContext)
  const isOpen = openIndex === index

  return (
    <ItemContainer $isOpen={isOpen}>
      {children}
    </ItemContainer>
  )
}

// Sub-componente Header
function AccordionHeader({
  index,
  children
}: {
  index: number
  children: React.ReactNode
}) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext)
  const isOpen = openIndex === index

  return (
    <Header
      onClick={() => setOpenIndex(isOpen ? null : index)}
      $isOpen={isOpen}
    >
      {children}
      <Icon $isOpen={isOpen}>▼</Icon>
    </Header>
  )
}

// Sub-componente Content
function AccordionContent({
  index,
  children
}: {
  index: number
  children: React.ReactNode
}) {
  const { openIndex } = useContext(AccordionContext)
  const isOpen = openIndex === index

  if (!isOpen) return null

  return <Content>{children}</Content>
}

// Exportar todo junto
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.Content = AccordionContent

// Styled components
const Container = styled.div`
  width: 100%;
`

const ItemContainer = styled.div<{ $isOpen: boolean }>`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
`

const Header = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.$isOpen ? '#f5f5f5' : 'white'};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  &:hover {
    background: #f5f5f5;
  }
`

const Icon = styled.span<{ $isOpen: boolean }>`
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`

const Content = styled.div`
  padding: 16px;
  background: white;
`

// USO:
function FAQPage() {
  return (
    <Accordion>
      <Accordion.Item index={0}>
        <Accordion.Header index={0}>
          ¿Cómo funciona el envío?
        </Accordion.Header>
        <Accordion.Content index={0}>
          El envío tarda entre 3-5 días hábiles...
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item index={1}>
        <Accordion.Header index={1}>
          ¿Aceptan devoluciones?
        </Accordion.Header>
        <Accordion.Content index={1}>
          Sí, tienes 30 días para devolver...
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
```

### 2. Render Props Pattern

Para compartir lógica entre componentes:

```typescript
// hooks/useProductData.ts
interface ProductDataProps {
  categoryId?: string
  children: (data: {
    products: Product[]
    loading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode
}

export function ProductData({ categoryId, children }: ProductDataProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch(`/api/products?categoryId=${categoryId}`)
      const json = await data.json()
      setProducts(json)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return children({ products, loading, error, refetch: fetchProducts })
}

// USO:
function ProductPage() {
  return (
    <ProductData categoryId="aceites">
      {({ products, loading, error, refetch }) => {
        if (loading) return <Spinner />
        if (error) return <Error error={error} onRetry={refetch} />
        return <ProductGrid products={products} />
      }}
    </ProductData>
  )
}
```

### 3. Custom Hooks Pattern

Extraer lógica reutilizable:

```typescript
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

// USO:
function ShoppingCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', [])

  const addToCart = (item: CartItem) => {
    setCart([...cart, item])
  }

  return (
    <div>
      <button onClick={() => addToCart(newItem)}>
        Add to Cart
      </button>
    </div>
  )
}
```

---

## 🔄 State Management Patterns

### 1. Reducer Pattern para Estado Complejo

```typescript
// reducers/cartReducer.ts
interface CartState {
  items: CartItem[]
  total: number
  loading: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(i => i.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: calculateTotal(state.items)
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: calculateTotal([...state.items, action.payload])
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        loading: false
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload
      }
    }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// USO:
function Cart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: false
  })

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  return (
    <div>
      {state.items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => removeItem(item.id)}
        />
      ))}
      <Total amount={state.total} />
    </div>
  )
}
```

### 2. Context + Reducer Pattern

```typescript
// context/CartContext.tsx
import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

// Custom hooks para acciones
export function useCartActions() {
  const { dispatch } = useCart()

  return {
    addItem: (item: CartItem) =>
      dispatch({ type: 'ADD_ITEM', payload: item }),

    removeItem: (id: string) =>
      dispatch({ type: 'REMOVE_ITEM', payload: id }),

    updateQuantity: (id: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),

    clearCart: () =>
      dispatch({ type: 'CLEAR_CART' })
  }
}

// USO:
function App() {
  return (
    <CartProvider>
      <ProductPage />
      <Cart />
    </CartProvider>
  )
}

function ProductPage() {
  const { addItem } = useCartActions()

  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  )
}

function Cart() {
  const { state } = useCart()
  const { removeItem } = useCartActions()

  return (
    <div>
      {state.items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🎣 Advanced Hooks Patterns

### 1. useDebounce Hook

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// USO: Search con debounce
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Fetch solo después de 500ms de que el usuario dejó de escribir
      fetchSearchResults(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search products..."
    />
  )
}
```

### 2. useIntersectionObserver Hook

```typescript
// hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

// USO: Infinite scroll
function ProductList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(loadMoreRef)

  useEffect(() => {
    if (isVisible) {
      loadMoreProducts()
    }
  }, [isVisible])

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={loadMoreRef}>Loading more...</div>
    </div>
  )
}
```

### 3. useMediaQuery Hook

```typescript
// hooks/useMediaQuery.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// USO: Responsive behavior
function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return isMobile ? <MobileMenu /> : <DesktopMenu />
}
```

---

## 🎨 Styling Patterns

### 1. Theme Variants

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#FFA000",
      light: "#FFB333",
      dark: "#CC8000",
      contrast: "#000000",
    },
    error: {
      main: "#D32F2F",
      light: "#E57373",
      dark: "#C62828",
      contrast: "#FFFFFF",
    },
  },
  spacing: (multiplier: number) => `${multiplier * 8}px`,
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    round: "9999px",
  },
  shadows: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
    md: "0 4px 8px rgba(0, 0, 0, 0.15)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.2)",
    xl: "0 12px 24px rgba(0, 0, 0, 0.25)",
  },
  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
};

// USO: Button con variants
const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: ${(props) => props.theme.spacing(1.5)}
    ${(props) => props.theme.spacing(3)};
  border-radius: ${(props) => props.theme.radius.md};
  transition: all ${(props) => props.theme.transitions.normal};
  border: none;
  cursor: pointer;

  ${(props) => {
    const color =
      props.variant === "secondary"
        ? props.theme.colors.secondary
        : props.theme.colors.primary;

    return `
      background: ${color.main};
      color: ${color.contrast};

      &:hover {
        background: ${color.dark};
      }

      &:active {
        background: ${color.light};
      }
    `;
  }}
`;
```

### 2. Responsive Mixins

```typescript
// styles/mixins.ts
import { css } from "styled-components";

export const respondTo = {
  mobile: (content: string) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      ${content}
    }
  `,
  tablet: (content: string) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      ${content}
    }
  `,
  desktop: (content: string) => css`
    @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
      ${content}
    }
  `,
};

// USO:
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(props) => props.theme.spacing(3)};

  ${respondTo.tablet(css`
    grid-template-columns: repeat(2, 1fr);
    gap: ${(props) => props.theme.spacing(2)};
  `)}

  ${respondTo.mobile(css`
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.spacing(1)};
  `)}
`;
```

---

## 🔐 Security Patterns

### 1. Input Sanitization

```typescript
// utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  })
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 1000) // Limit length
}

// USO:
function CommentForm() {
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    const sanitized = sanitizeInput(comment)
    await submitComment(sanitized)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        maxLength={1000}
      />
    </form>
  )
}
```

### 2. Rate Limiting

```typescript
// utils/rateLimit.ts
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// USO en API route:
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip, 5, 60000)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // Process request...
}
```

---

## 🚀 Performance Patterns

### 1. Memoization

```typescript
// Memoize expensive calculations
const ExpensiveComponent = memo(function ExpensiveComponent({
  data
}: {
  data: ComplexData
}) {
  const processedData = useMemo(() => {
    // Heavy calculation
    return data.items.map(item => ({
      ...item,
      calculated: heavyCalculation(item)
    }))
  }, [data])

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.calculated}</div>
      ))}
    </div>
  )
})

// Memoize callbacks
function ProductList({ onProductClick }: Props) {
  const handleClick = useCallback((id: string) => {
    onProductClick(id)
  }, [onProductClick])

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => handleClick(product.id)}
        />
      ))}
    </div>
  )
}
```

### 2. Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <Skeleton />,
  ssr: false // Don't render on server
})

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  ssr: false
})

function Page() {
  return (
    <div>
      <Header />
      <HeavyComponent />
      <AdminPanel />
    </div>
  )
}
```

### 3. Virtual Scrolling

```typescript
// Para listas muy largas
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualProductList({ products }: { products: Product[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Height of each item
    overscan: 5 // Render 5 extra items
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

**Estos patrones están probados en producción y optimizados para e-commerce.** 🎯
