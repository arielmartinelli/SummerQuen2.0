/**
 * SUMMER QUEEN - COMPONENTS & UI UTILITIES
 * Contiene el registro de vistas globales y componentes dinámicos compartidos.
 */

// Inicializar contenedores de vistas y componentes en el scope global
window.views = {};
window.components = {};

// --- 1. GESTION DE TEMAS (DARK / LIGHT MODE) ---
function initTheme() {
    const savedTheme = localStorage.getItem("sq_theme") || "dark";
    if (savedTheme === "light") {
        document.body.className = "light-theme";
    } else {
        document.body.className = "dark-theme";
    }

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            if (document.body.classList.contains("dark-theme")) {
                document.body.className = "light-theme";
                localStorage.setItem("sq_theme", "light");
            } else {
                document.body.className = "dark-theme";
                localStorage.setItem("sq_theme", "dark");
            }
        });
    }
}

// Inicializar tema al cargar
window.addEventListener("DOMContentLoaded", initTheme);

// --- 2. FLOATING TOAST NOTIFICATIONS ---
window.components.showToast = function(message, type = "success") {
    // Buscar o crear contenedor de toasts
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Crear toast
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    // Icono según tipo
    let icon = "check-circle";
    if (type === "error") icon = "alert-circle";
    if (type === "info") icon = "info";

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    // Dibujar icono de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Auto-eliminar después de 3.5 segundos
    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
            // Borrar contenedor si está vacío
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 3500);
};

// --- 3. RENDERING PRODUCT CARD (REUSABLE) ---
window.components.renderProductCard = function(product) {
    // Comprobar si hay bajo stock para mostrar etiqueta especial
    let badgeHtml = "";
    if (product.stock <= 5 && product.stock > 0) {
        badgeHtml = `<div class="product-badge" style="background-color: var(--color-warning);">¡Últimas ${product.stock} un.!</div>`;
    } else if (product.stock === 0) {
        badgeHtml = `<div class="product-badge" style="background-color: var(--color-danger);">Sin Stock</div>`;
    } else if (product.featured) {
        badgeHtml = `<div class="product-badge">Destacado</div>`;
    }

    // Formatear precio en ARS
    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(product.price);

    // Variantes de colores para mostrar bolitas de colores debajo
    let colorsHtml = "";
    if (product.colors && product.colors.length > 0) {
        colorsHtml = `<div class="color-swatch-list" style="margin-top: 0.5rem; justify-content: flex-start; pointer-events: none;">`;
        product.colors.forEach(col => {
            // Mapeo básico de color a Hex
            let colorHex = "#888";
            const colLower = col.toLowerCase();
            if (colLower.includes("negro")) colorHex = "#1a1a1a";
            else if (colLower.includes("azul")) colorHex = "#1e3a8a";
            else if (colLower.includes("borgoña") || colLower.includes("rojo")) colorHex = "#800020";
            else if (colLower.includes("gris")) colorHex = "#8a8a8a";
            else if (colLower.includes("blanco")) colorHex = "#f3f4f6";
            else if (colLower.includes("verde")) colorHex = "#2d5a27";
            else if (colLower.includes("mostaza") || colLower.includes("ocre")) colorHex = "#ca8a04";
            else if (colLower.includes("arena") || colLower.includes("kaki")) colorHex = "#d2b48c";
            else if (colLower.includes("rosa")) colorHex = "#f472b6";
            else if (colLower.includes("amarillo")) colorHex = "#eab308";
            
            colorsHtml += `<span class="color-swatch" style="background-color: ${colorHex}; width:16px; height:16px; min-width:16px; border: 1px solid var(--color-border);"></span>`;
        });
        colorsHtml += `</div>`;
    }

    return `
        <article class="product-card">
            ${badgeHtml}
            <div class="product-card-image">
                <a href="#/product/${product.id}">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </a>
            </div>
            <div class="product-card-info">
                <span class="product-card-category">${product.category}</span>
                <h3 class="product-card-title">
                    <a href="#/product/${product.id}">${product.title}</a>
                </h3>
                ${colorsHtml}
                <div class="product-card-price" style="margin-top: 1rem;">${formattedPrice}</div>
                <div style="display: flex; gap: 0.5rem; width:100%;">
                    <a href="#/product/${product.id}" class="btn btn-outline btn-sm" style="flex-grow: 1;">Ver Detalles</a>
                    <button class="btn btn-primary btn-sm add-quick-cart" data-id="${product.id}" style="padding: 0.5rem;" aria-label="Agregar al carrito" ${product.stock === 0 ? 'disabled' : ''}>
                        <i data-lucide="shopping-cart" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
};

// --- 4. RENDER CART DRAWER CONTENT ---
window.components.renderCartDrawer = function() {
    const cart = window.state.getCart();
    const cartDrawerBody = document.getElementById("cartDrawerBody");
    const checkoutBtn = document.getElementById("checkoutBtn");
    
    if (!cartDrawerBody) return;

    if (cart.length === 0) {
        cartDrawerBody.innerHTML = `
            <div class="empty-cart-state">
                <i data-lucide="shopping-bag"></i>
                <p>Tu carrito está vacío</p>
                <a href="#/catalog" class="btn btn-primary btn-sm" id="emptyCartCatalogLink">Ver Catálogo</a>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
        
        // Registrar evento para cerrar carrito al hacer click en el botón del carrito vacío
        const link = document.getElementById("emptyCartCatalogLink");
        if (link) {
            link.addEventListener("click", () => {
                document.getElementById("cartDrawer").classList.remove("active");
                document.getElementById("cartOverlay").classList.remove("active");
            });
        }
        
        // Actualizar totales a 0
        document.getElementById("cartDrawerSubtotal").textContent = "$0";
        document.getElementById("cartDrawerTotal").textContent = "$0";
        document.getElementById("cartDrawerDiscountRow").style.display = "none";
        
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    // Renderizar items
    let itemsHtml = "";
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const formattedItemTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(itemTotal);
        
        // Crear textos descriptivos de variantes
        let variantText = "";
        if (item.color) variantText += `Color: ${item.color}`;
        if (item.size) variantText += (variantText ? " | " : "") + `Talle: ${item.size}`;

        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <span class="cart-item-variant">${variantText}</span>
                    <div class="cart-item-bottom">
                        <div class="cart-item-quantity">
                            <button class="qty-btn qty-minus" data-id="${item.productId}" data-color="${item.color}" data-size="${item.size}">
                                <i data-lucide="minus" style="width: 12px; height: 12px;"></i>
                            </button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-id="${item.productId}" data-color="${item.color}" data-size="${item.size}">
                                <i data-lucide="plus" style="width: 12px; height: 12px;"></i>
                            </button>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.8rem;">
                            <span class="cart-item-price">${formattedItemTotal}</span>
                            <button class="cart-item-remove" data-id="${item.productId}" data-color="${item.color}" data-size="${item.size}">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartDrawerBody.innerHTML = itemsHtml;

    // Calcular y renderizar totales
    const totals = window.state.getCartTotals();
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });
    
    document.getElementById("cartDrawerSubtotal").textContent = formatter.format(totals.subtotal);
    document.getElementById("cartDrawerTotal").textContent = formatter.format(totals.total);
    
    const discountRow = document.getElementById("cartDrawerDiscountRow");
    if (totals.discount > 0) {
        discountRow.style.display = "flex";
        document.getElementById("cartDrawerDiscount").textContent = "-" + formatter.format(totals.discount);
    } else {
        discountRow.style.display = "none";
    }

    // Configurar controladores de eventos para los botones de cantidad y borrado
    this.initCartDrawerEvents(cartDrawerBody);
    
    if (window.lucide) window.lucide.createIcons();
};

window.components.initCartDrawerEvents = function(container) {
    // Botón Menos cantidad
    container.querySelectorAll(".qty-minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            const id = btnEl.getAttribute("data-id");
            const color = btnEl.getAttribute("data-color");
            const size = btnEl.getAttribute("data-size");
            const currentQty = parseInt(btnEl.nextElementSibling.textContent);
            
            window.state.updateCartQty(id, color, size, currentQty - 1);
            window.components.renderCartDrawer();
        });
    });

    // Botón Mas cantidad
    container.querySelectorAll(".qty-plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            const id = btnEl.getAttribute("data-id");
            const color = btnEl.getAttribute("data-color");
            const size = btnEl.getAttribute("data-size");
            const currentQty = parseInt(btnEl.previousElementSibling.textContent);
            
            // Validar stock antes de sumar
            const prod = window.state.getProductById(id);
            if (prod && currentQty >= prod.stock) {
                window.components.showToast("Stock límite alcanzado", "info");
                return;
            }

            window.state.updateCartQty(id, color, size, currentQty + 1);
            window.components.renderCartDrawer();
        });
    });

    // Botón Eliminar
    container.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            const id = btnEl.getAttribute("data-id");
            const color = btnEl.getAttribute("data-color");
            const size = btnEl.getAttribute("data-size");
            
            window.state.removeFromCart(id, color, size);
            window.components.renderCartDrawer();
            window.components.showToast("Producto eliminado del carrito", "info");
        });
    });
};

// Evento global para clicks de "agregar rápido al carrito" en grids de productos
document.addEventListener("click", (e) => {
    const quickAddBtn = e.target.closest(".add-quick-cart");
    if (quickAddBtn) {
        e.preventDefault();
        const id = quickAddBtn.getAttribute("data-id");
        const product = window.state.getProductById(id);
        
        if (product) {
            // Seleccionar por defecto primera variante o vacio
            const color = product.colors && product.colors.length > 0 ? product.colors[0] : "";
            const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "";
            
            const success = window.state.addToCart(id, 1, color, size);
            if (success) {
                window.components.showToast(`¡${product.title} agregado al carrito!`, "success");
                // Abrir el carrito lateral automáticamente para guiar al usuario
                document.getElementById("cartDrawer").classList.add("active");
                document.getElementById("cartOverlay").classList.add("active");
                window.components.renderCartDrawer();
            }
        }
    }
});
