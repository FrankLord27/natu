"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, getOrderConfirmationTemplate } from "@/lib/email";

/**
 * Acciones de Servidor (Server Actions) para la gestión de productos y categorías.
 * Estas funciones se ejecutan en el servidor y pueden ser llamadas desde componentes de cliente.
 */

// --- Productos (Lógica de Tienda y Pública) ---

/**
 * Obtiene una lista de productos filtrados por búsqueda, categoría, rango de precio y calificación.
 * Solo devuelve productos activos.
 *
 * @param options - Opciones de filtrado (query, category, minPrice, maxPrice, minRating, sort).
 * @returns Objeto con éxito, datos (array de productos) o error.
 */
export async function getProducts(options: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const { 
      query, category, minPrice, maxPrice, minRating, sort, 
      page = 1, limit = 12 
    } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        category && category !== "Todos"
          ? {
              category: { name: category },
            }
          : {},
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
        minRating !== undefined ? { averageRating: { gte: minRating } } : {},
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: 
          sort === 'price-asc' ? { price: 'asc' } :
          sort === 'price-desc' ? { price: 'desc' } :
          sort === 'rating' ? { averageRating: 'desc' } :
          { createdAt: 'desc' },
      }),
      prisma.product.count({ where })
    ]);

    return { 
      success: true, 
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { success: false, error: "No se pudieron cargar los productos" };
  }
}

/**
 * Obtiene un producto específico mediante su slug único.
 * Incluye la categoría y las últimas 10 reseñas con la información del usuario.
 *
 * @param slug - El slug identificador del producto.
 * @returns Objeto con éxito, datos del producto o error.
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!product) return { success: false, error: "Producto no encontrado" };
    return { success: true, data: product };
  } catch (error) {
    console.error("Error al obtener producto por slug:", error);
    return { success: false, error: "No se pudo cargar el producto" };
  }
}

/**
 * Obtiene todas las categorías disponibles ordenadas alfabéticamente.
 * También incluye el conteo de productos asociados a cada categoría.
 *
 * @returns Objeto con éxito, datos (array de categorías) o error.
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return { success: true, data: categories };
  } catch {
    return { success: false, error: "No se pudieron cargar las categorías" };
  }
}

// --- Gestión de Productos (Admin) ---

/**
 * Crea un nuevo producto en la base de datos.
 * automaticamete genera el slug y revalida las rutas necesarias.
 *
 * @param formData - Objeto con los datos del nuevo producto.
 * @returns Objeto con éxito, datos del producto creado o mensaje de error.
 */
export async function createProduct(formData: {
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  stock: string;
  categoryId: string;
  imageUrls?: string[];
  isActive?: boolean;
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  ingredients?: string;
  howToUse?: string;
  warnings?: string;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: formData.name,
        slug: formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        imageUrls: formData.imageUrls || [],
        isActive: formData.isActive ?? true,
        brand: formData.brand,
        sku: formData.sku,
        weight: formData.weight,
        dimensions: formData.dimensions,
        ingredients: formData.ingredients,
        howToUse: formData.howToUse,
        warnings: formData.warnings,
      },
    });
    // Forzamos la actualización de las páginas para reflejar los nuevos datos
    revalidatePath("/tienda");
    revalidatePath("/admin/productos");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    return {
      success: false,
      error: error?.message || "Error al crear el producto",
    };
  }
}

/**
 * Actualiza la información de un producto existente.
 *
 * @param id - ID único del producto a actualizar.
 * @param formData - Objeto con los campos a actualizar.
 * @returns Objeto con éxito, datos del producto actualizado o error.
 */
export async function updateProduct(
  id: string,
  formData: {
    name?: string;
    description?: string;
    price?: string;
    discountPrice?: string;
    stock?: string;
    categoryId?: string;
    imageUrls?: string[];
    isActive?: boolean;
    brand?: string;
    sku?: string;
    weight?: string;
    dimensions?: string;
    ingredients?: string;
    howToUse?: string;
    warnings?: string;
  },
) {
  try {
    const data: any = {};
    if (formData.name !== undefined) {
      data.name = formData.name;
      data.slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    if (formData.description !== undefined)
      data.description = formData.description;
    if (formData.price !== undefined) data.price = parseFloat(formData.price);
    if (formData.discountPrice !== undefined)
      data.discountPrice = formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : null;
    if (formData.stock !== undefined) data.stock = parseInt(formData.stock);
    if (formData.categoryId !== undefined)
      data.categoryId = formData.categoryId;
    if (formData.imageUrls !== undefined) data.imageUrls = formData.imageUrls;
    if (formData.isActive !== undefined) data.isActive = formData.isActive;
    if (formData.brand !== undefined) data.brand = formData.brand;
    if (formData.sku !== undefined) data.sku = formData.sku;
    if (formData.weight !== undefined) data.weight = formData.weight;
    if (formData.dimensions !== undefined)
      data.dimensions = formData.dimensions;
    if (formData.ingredients !== undefined)
      data.ingredients = formData.ingredients;
    if (formData.howToUse !== undefined) data.howToUse = formData.howToUse;
    if (formData.warnings !== undefined) data.warnings = formData.warnings;

    const product = await prisma.product.update({ where: { id }, data });
    revalidatePath("/tienda");
    revalidatePath("/admin/productos");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Error al actualizar producto:", error);
    return {
      success: false,
      error: error?.message || "Error al actualizar el producto",
    };
  }
}

/**
 * Elimina un producto de la base de datos de forma permanente.
 *
 * @param id - ID único del producto.
 * @returns Objeto con éxito o error.
 */
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/tienda");
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { success: false, error: "Error al eliminar el producto" };
  }
}

/**
 * Cambia el estado de visibilidad (isActive) de un producto.
 *
 * @param id - ID único del producto.
 * @param currentState - El estado actual de visibilidad (true/false).
 * @returns Objeto con éxito o error.
 */
export async function toggleProductVisibility(
  id: string,
  currentState: boolean,
) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: !currentState },
    });
    revalidatePath("/tienda");
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error al alternar visibilidad:", error);
    return { success: false, error: "Error al cambiar la visibilidad" };
  }
}

// --- Funciones de Utilidad para el Administrador ---

/**
 * Obtiene todos los productos para la vista de administrador.
 * A diferencia de getProducts, esta incluye también los productos inactivos.
 *
 * @returns Objeto con éxito y la lista de todos los productos.
 */
export async function getAdminProducts(options: { page?: number; limit?: number; search?: string } = {}) {
  try {
    const { page = 1, limit = 10, search = '' } = options;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    return { 
      success: true, 
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error al obtener productos admin:", error);
    return {
      success: false,
      error: "Error al cargar los productos para el administrador",
    };
  }
}

/**
 * Busca un producto por su ID único.
 *
 * @param id - ID único del producto.
 * @returns Objeto con éxito y los datos del producto o mensaje de error.
 */
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return { success: false, error: "Producto no encontrado" };
    return { success: true, data: product };
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    return { success: false, error: "Error al buscar el producto" };
  }
}
/**
 * Crea una nueva reseña para un producto.
 * Valida la sesión del usuario y si ya existe una reseña previa.
 *
 * @param data - Datos de la reseña (productId, rating, title, content).
 * @returns Objeto con éxito o error.
 */
export async function submitReview(data: {
  productId: string;
  rating: number;
  title?: string;
  content: string;
}) {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "customer") {
      return { success: false, error: "Debes iniciar sesión como cliente para dejar una reseña" };
    }

    const userId = (session.user as any).id;

    // Verificar si ya existe una reseña
    const existing = await prisma.review.findFirst({
      where: { userId, productId: data.productId },
    });

    if (existing) {
      return { success: false, error: "Ya has dejado una reseña para este producto" };
    }

    await prisma.review.create({
      data: {
        productId: data.productId,
        userId,
        rating: data.rating,
        title: data.title || "",
        content: data.content,
      },
    });

    revalidatePath(`/productos/[slug]`, "layout");
    return { success: true };
  } catch (error) {
    console.error("Error al enviar reseña:", error);
    return { success: false, error: "No se pudo enviar la reseña" };
  }
}
/**
 * Procesa el pago de un pedido, genera la factura y registra las entradas contables.
 *
 * @param orderId - ID del pedido pagado.
 * @returns Objeto con éxito o error.
 */
export async function processOrderPayment(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        items: {
          include: { product: true }
        }, 
        invoice: true, 
        user: true 
      }
    });

    if (!order) return { success: false, error: "Pedido no encontrado" };
    if (order.status !== 'PAID') {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
    }

    // Si ya tiene factura, no hacemos nada
    if (order.invoice) return { success: true, message: "El pedido ya está procesado" };

    // Generar número de factura secuencial (simplificado)
    const count = await prisma.invoice.count();
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Cálculos contables (Asumiendo 18% ITBIS/IVA)
    const subtotal = order.total / 1.18;
    const taxAmount = order.total - subtotal;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        subtotal,
        taxAmount,
        total: order.total,
        status: 'PAID'
      }
    });

    // Registrar Ingreso Contable
    await prisma.accountingEntry.create({
      data: {
        type: 'INCOME',
        category: 'SALES',
        amount: order.total,
        description: `Venta - Pedido #${order.id.slice(-6)}`,
        orderId,
        invoiceId: invoice.id
      }
    });

    // Registrar Costo de Mercancía (COGS)
    const totalCost = order.items.reduce((sum: number, item: any) => sum + (item.costPrice * item.quantity), 0);
    if (totalCost > 0) {
      await prisma.accountingEntry.create({
        data: {
          type: 'EXPENSE',
          category: 'COGS',
          amount: totalCost,
          description: `Costo de venta - Pedido #${order.id.slice(-6)}`,
          orderId,
          invoiceId: invoice.id
        }
      });
    }

    // Enviar correo de confirmación con Factura
    if (order.user?.email || (order as any).customerEmail) {
      const { getInvoiceEmailHtml } = await import("@/lib/email-templates");
      
      const emailHtml = getInvoiceEmailHtml({
        orderId: order.id,
        customerName: order.user?.name || (order as any).customerName || 'Cliente',
        total: order.total,
        items: order.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        invoiceUrl: invoice.pdfUrl || `${process.env.NEXT_PUBLIC_APP_URL}/admin/pedidos/${order.id}/factura`
      });

      await sendEmail({
        to: order.user?.email || (order as any).customerEmail,
        subject: `Confirmación de Pedido #${order.id.slice(-6)} - NaturaJM`,
        html: emailHtml
      });
    }

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin/contabilidad");
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error al procesar pago:", error);
    return { success: false, error: "Error al procesar el pago contablemente" };
  }
}

/**
 * Obtiene métricas financieras agregadas para el dashboard contable.
 *
 * @returns Objeto con éxito y métricas (ingresos, costos, beneficios).
 */
export async function getFinancialSummary() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const entries = await prisma.accountingEntry.findMany({
      where: { date: { gte: startOfMonth } }
    });

    const income = entries.filter((e: any) => e.type === 'INCOME').reduce((s: number, e: any) => s + e.amount, 0);
    const expense = entries.filter((e: any) => e.type === 'EXPENSE').reduce((s: number, e: any) => s + e.amount, 0);

    // Obtener tendencia de los últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const history = await prisma.accountingEntry.findMany({
      where: { date: { gte: sixMonthsAgo } },
      orderBy: { date: 'asc' }
    });

    // Agrupar por mes para gráficos
    const monthlyData: Record<string, any> = {};
    history.forEach((e: any) => {
      const month = e.date.toLocaleString('es-ES', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, profit: 0, expense: 0 };
      
      if (e.type === 'INCOME') {
        monthlyData[month].income += e.amount;
        monthlyData[month].profit += e.amount;
      } else {
        monthlyData[month].expense += e.amount;
        monthlyData[month].profit -= e.amount;
      }
    });

    return {
      success: true,
      data: {
        currentMonth: { income, expense, profit: income - expense },
      }
    };
  } catch (error) {
    console.error("Error al obtener resumen financiero:", error);
    return { success: false, error: "Error al cargar datos contables" };
  }
}

// --- Gestión de Inventario Avanzada ---

/**
 * Obtiene productos cuyo stock es menor o igual a su nivel mínimo definido.
 *
 * @returns Lista de productos con stock bajo.
 */
export async function getLowStockProducts() {
  try {
    // Prisma no soporta comparar dos columnas directamente en el 'where' de forma sencilla en todas las versiones,
    // pero podemos filtrar en memoria o usar raw query si fuera necesario.
    // Para simplificar y dado que el catálogo no es masivo, traemos productos activos y filtramos.
    // Una opción más eficiente en SQL nativo sería: WHERE stock <= minStockLevel
    
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, sku: true, stock: true, minStockLevel: true, imageUrls: true }
    });

    const lowStock = products.filter((p: any) => p.stock <= p.minStockLevel);

    return { success: true, data: lowStock };
  } catch (error) {
    console.error("Error al obtener stock bajo:", error);
    return { success: false, error: "Error al cargar alertas de stock" };
  }
}

/**
 * Ajusta el stock de un producto y registra el movimiento en el historial.
 *
 * @param productId - ID del producto.
 * @param newStock - Nueva cantidad total de stock.
 * @param reason - Razón del ajuste (ej. "Reabastecimiento", "Pérdida", "Ajuste manual").
 * @param notes - Notas opcionales.
 */
export async function adjustInventory(productId: string, newStock: number, reason: string, notes?: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { success: false, error: "Producto no encontrado" };

    const oldStock = product.stock;
    const diff = newStock - oldStock;
    const type = diff >= 0 ? 'IN' : 'OUT';

    const historyEntry = {
      date: new Date().toISOString(),
      type,
      quantity: Math.abs(diff),
      oldStock,
      newStock,
      reason,
      notes,
      user: 'Admin' // Idealmente obtener del session
    };

    // Actualizar producto y añadir al historial (JSON array)
    // Prisma JSON append workaround: traer historial existente y pushear
    const currentHistory = (product.inventoryHistory as any[]) || [];
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 50); // Mantener últimos 50 movimientos

    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: newStock,
        inventoryHistory: updatedHistory
      }
    });

    revalidatePath("/admin/inventario");
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error al ajustar inventario:", error);
    return { success: false, error: "Error al actualizar inventario" };
  }
}
// --- Marketing & Retention ---

/**
 * Suscribe un correo al newsletter.
 *
 * @param email - Correo a suscribir.
 * @param source - Fuente de la suscripción (ej. "footer").
 */
export async function subscribeToNewsletter(email: string, source: string = "footer") {
  try {
    // Validar formato de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Correo electrónico inválido" };
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, source } // Reactivar
        });
        return { success: true, message: "¡Suscripción reactivada!" };
      }
      return { success: true, message: "Ya estás suscrito al newsletter." };
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source,
        tags: ["lead"]
      }
    });

    return { success: true, message: "¡Gracias por suscribirte!" };
  } catch (error) {
    console.error("Error newsletter:", error);
    return { success: false, error: "Error al suscribirse." };
  }
}

/**
 * Sincroniza el estado de un carrito abandonado o en proceso.
 *
 * @param cartToken - Token único del carrito (identificador persistente).
 * @param data - Datos del carrito (email, items, total).
 */
export async function syncAbandonedCart(cartToken: string, data: { email?: string; items: any; total: number }) {
  try {
    if (!cartToken) return { success: false, error: "Cart token required" };

    const cart = await prisma.abandonedCart.upsert({
      where: { cartToken },
      update: {
        email: data.email,
        items: data.items,
        total: data.total,
        recovered: false
      },
      create: {
        cartToken,
        email: data.email,
        items: data.items,
        total: data.total,
        recovered: false
      }
    });

    return { success: true, id: cart.id };
  } catch (error) {
    console.error("Error al sincronizar carrito:", error);
    return { success: false, error: "Error al sincronizar carrito" };
  }
}
