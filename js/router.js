/**
 * SUMMER QUEEN - ROUTER
 * Maneja el enrutamiento del lado del cliente basado en Hash (#/)
 */

class Router {
    constructor() {
        this.routes = {
            'home': window.views.home,
            'catalog': window.views.catalog,
            'product': window.views.product,
            'checkout': window.views.checkout,
            'contact': window.views.contact,
            'admin': window.views.admin
        };

        window.addEventListener('hashchange', () => this.handleRouting());
        
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.handleRouting();
        this.initGlobalEvents();
    }

    // Navegar programáticamente
    navigate(path) {
        window.location.hash = path;
    }

    parseHash() {
        const hash = window.location.hash || '#/';
        const cleanHash = hash.replace(/^#\//, '');
        
        // Separar ruta y query params (e.g. catalog?category=mochilas)
        const [pathWithParams, queryString] = cleanHash.split('?');
        
        // Parsear query params
        const query = {};
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, val] = param.split('=');
                query[decodeURIComponent(key)] = decodeURIComponent(val);
            });
        }

        // Separar segmentos para rutas dinámicas (e.g. product/prod-1)
        const segments = pathWithParams.split('/');
        const route = segments[0] || 'home';
        const param = segments[1] || null;

        return { route, param, query };
    }

    handleRouting() {
        const { route, param, query } = this.parseHash();
        
        // Seleccionar vista
        const view = this.routes[route] || this.routes['home'];
        
        // Renderizar la vista en el contenedor principal
        const appContainer = document.getElementById('app');
        if (appContainer) {
            // Mostrar animación de carga suave
            appContainer.innerHTML = `
                <div class="loader-container">
                    <div class="loader"></div>
                </div>
            `;
            
            // Retraso intencional mínimo para simular carga y hacer las transiciones más orgánicas
            setTimeout(() => {
                try {
                    // Cargar vista con parámetros
                    view.render(appContainer, param, query);
                    this.updateActiveNav(route);
                    // Redibujar iconos dinámicos
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                    // Desplazar al inicio de la página
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } catch (error) {
                    console.error("Error cargando la vista: ", error);
                    appContainer.innerHTML = `
                        <div class="container" style="padding: 5rem 2rem; text-align: center;">
                            <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">Ocurrió un error</h2>
                            <p style="color: var(--color-text-muted); margin-bottom: 2rem;">No pudimos cargar esta página. Inténtalo de nuevo.</p>
                            <a href="#/" class="btn btn-primary">Volver al Inicio</a>
                        </div>
                    `;
                }
            }, 300);
        }
    }

    updateActiveNav(activeRoute) {
        const navLinks = document.querySelectorAll('#navMenu .nav-link');
        navLinks.forEach(link => {
            const dataRoute = link.getAttribute('data-route');
            if (dataRoute === activeRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Cerrar menú móvil al cambiar de ruta
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    initGlobalEvents() {
        // Toggle Menú Móvil
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Toggle del Carrito Lateral
        const cartBtn = document.getElementById('cartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartDrawer = document.getElementById('cartDrawer');
        const checkoutBtn = document.getElementById('checkoutBtn');

        const openCart = () => {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            window.components.renderCartDrawer();
        };

        const closeCart = () => {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        };

        if (cartBtn) cartBtn.addEventListener('click', openCart);
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                closeCart();
                const cart = window.state.getCart();
                if (cart.length === 0) {
                    window.components.showToast("Tu carrito está vacío", "info");
                    return;
                }
                this.navigate('#/checkout');
            });
        }

        // Configurar Cupón de descuento en carrito lateral
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        const couponInput = document.getElementById('couponInput');
        
        if (applyCouponBtn && couponInput) {
            applyCouponBtn.addEventListener('click', () => {
                const code = couponInput.value;
                if (!code) return;
                
                const res = window.state.applyCoupon(code);
                const msgEl = document.getElementById('couponMessage');
                
                if (res.success) {
                    msgEl.className = "coupon-msg success";
                    msgEl.textContent = `¡Cupón aplicado! Descuento: ${(res.discount * 100)}%`;
                    window.components.showToast("Cupón aplicado correctamente", "success");
                    couponInput.value = "";
                } else {
                    msgEl.className = "coupon-msg error";
                    msgEl.textContent = res.message;
                    window.components.showToast(res.message, "error");
                }
            });
        }

        // Suscribirse a cambios en el carrito para actualizar el badge superior
        window.state.subscribe("cart", () => {
            this.updateCartBadge();
        });

        // Inicializar badge del carrito
        this.updateCartBadge();
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const totals = window.state.getCartTotals();
            cartBadge.textContent = totals.itemCount;
            // Animación pop al cambiar
            cartBadge.style.animation = 'none';
            cartBadge.offsetHeight; /* trigger reflow */
            cartBadge.style.animation = null;
        }
    }
}

// Inicializar el router directamente
window.router = new Router();
