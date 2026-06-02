/**
 * SUMMER QUEEN - STATE MANAGEMENT & DATA LAYER
 * Emula una base de datos local usando localStorage con datos precargados.
 */

// Helper para generar imágenes SVG modernas en Base64 para evitar depender de URLs externas
function generateMockSvg(category, title, hexColor = "#e67e22") {
    const cleanTitle = title.replace(/['"<>]/g, "");
    
    // Iconos SVG según categoría
    let iconPath = "";
    if (category === "egresados") {
        // Silueta de buzo / campera
        iconPath = `<path d="M12 2L4 6v6c0 5.25 3.42 10.12 8 11.5 4.58-1.38 8-6.25 8-11.5V6l-8-4zm0 2.2a2.8 2.8 0 110 5.6 2.8 2.8 0 010-5.6zM7 16h10c.8 0 1.5-.7 1.5-1.5v-1c0-1.7-2.3-3-5.5-3s-5.5 1.3-5.5 3v1c0 .8.7 1.5 1.5 1.5z" fill="white" opacity="0.8"/>`;
    } else if (category === "mochilas") {
        // Silueta de mochila
        iconPath = `<path d="M4 11V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3m-16 0h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8zm8-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round" opacity="0.8"/>`;
    } else {
        // Silueta de accesorio / gorra
        iconPath = `<path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9zm0 0V1m0 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
            <linearGradient id="grad-${cleanTitle.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="${hexColor}" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-${cleanTitle.replace(/\s+/g, '')})" />
        <g transform="translate(100, 70) scale(8)">
            ${iconPath}
        </g>
        <rect x="0" y="320" width="400" height="80" fill="rgba(0,0,0,0.4)" backdrop-filter="blur(5px)" />
        <text x="20" y="355" font-family="'Outfit', sans-serif" font-weight="700" font-size="20" fill="white" letter-spacing="0.5">${cleanTitle}</text>
        <text x="20" y="380" font-family="'Outfit', sans-serif" font-weight="500" font-size="14" fill="${hexColor}" letter-spacing="1" text-transform="uppercase">${category.toUpperCase()}</text>
    </svg>`;
    
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Datos Semilla (Seed Data)
const SEED_PRODUCTS = [
    {
        id: "prod-1",
        title: "Buzo Egresados Universe",
        category: "egresados",
        price: 28500,
        onSale: true,
        salePrice: 22800,
        description: "Buzo de algodón con friza premium. Diseño espacial bordado con hilos metálicos importados. Capucha forrada, puños reforzados y estampado personalizado con nombre en espalda.",
        materials: "80% Algodón Rústico, 20% Poliéster",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Azul Marino", "Negro Carbono", "Borgoña"],
        stock: 45,
        featured: true,
        image: generateMockSvg("egresados", "Buzo Universe", "#3b82f6"),
        images: [
            generateMockSvg("egresados", "Buzo Universe - Frente", "#3b82f6"),
            generateMockSvg("egresados", "Buzo Universe - Espalda", "#1e3a8a"),
            generateMockSvg("egresados", "Buzo Universe - Textura", "#60a5fa")
        ]
    },
    {
        id: "prod-2",
        title: "Campera Varsity Retro",
        category: "egresados",
        price: 34900,
        onSale: false,
        salePrice: 0,
        description: "Campera universitaria estilo retro. Cuerpo de paño de lana sintética de alta densidad y mangas de cuero ecológico ultra suave. Broches a presión metálicos y apliques bordados de toalla.",
        materials: "Paño de lana sintética y mangas de eco-cuero",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Rojo/Blanco", "Negro/Blanco", "Verde/Blanco"],
        stock: 30,
        featured: true,
        image: generateMockSvg("egresados", "Campera Varsity", "#ef4444"),
        images: [
            generateMockSvg("egresados", "Campera Varsity - Vista General", "#ef4444"),
            generateMockSvg("egresados", "Campera Varsity - Detalle Bordado", "#991b1b")
        ]
    },
    {
        id: "prod-3",
        title: "Chomba Egresados Vintage",
        category: "egresados",
        price: 16500,
        onSale: false,
        salePrice: 0,
        description: "Chomba clásica confeccionada en pique peinado. Cuello de tejeduría reforzado con vivos en contraste y logo bordado en alta definición en el pecho. Corte ergonómico.",
        materials: "100% Algodón Pique Peinado",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gris Melange", "Blanco Óptico", "Azul Francia"],
        stock: 60,
        featured: false,
        image: generateMockSvg("egresados", "Chomba Vintage", "#10b981"),
        images: [generateMockSvg("egresados", "Chomba Vintage", "#10b981")]
    },
    {
        id: "prod-4",
        title: "Mochila Urban Tech Rolltop",
        category: "mochilas",
        price: 22000,
        onSale: true,
        salePrice: 18700,
        description: "Mochila impermeable con sistema de cierre rolltop y hebilla magnética de liberación rápida. Compartimento acolchado independiente para notebooks de hasta 16 pulgadas. Espalda termoformada con canales de ventilación.",
        materials: "Cordura 1000D impermeable, Forro de Nylon ripstop",
        sizes: ["20L", "25L"],
        colors: ["Negro Mate", "Gris Asfalto", "Mostaza"],
        stock: 25,
        featured: true,
        image: generateMockSvg("mochilas", "Mochila Urban Tech", "#eab308"),
        images: [
            generateMockSvg("mochilas", "Mochila Urban Tech - Cerrada", "#eab308"),
            generateMockSvg("mochilas", "Mochila Urban Tech - Interior", "#ca8a04"),
            generateMockSvg("mochilas", "Mochila Urban Tech - Puesta", "#fef08a")
        ]
    },
    {
        id: "prod-5",
        title: "Mochila Canvas Classic",
        category: "mochilas",
        price: 19500,
        onSale: false,
        salePrice: 0,
        description: "Diseño clásico de lona de algodón de alta resistencia con detalles en cuero natural genuino. Hebillas de bronce viejo con sistema magnético oculto. Bolsillo frontal amplio y bolsillo interior porta-tablets.",
        materials: "Lona 100% Algodón, Detalles en Cuero Vacuno",
        sizes: ["18L"],
        colors: ["Beige Arena", "Verde Oliva", "Azul Denim"],
        stock: 20,
        featured: false,
        image: generateMockSvg("mochilas", "Mochila Canvas", "#84cc16"),
        images: [generateMockSvg("mochilas", "Mochila Canvas", "#84cc16")]
    },
    {
        id: "prod-6",
        title: "Gorra Snapback Premium",
        category: "accesorios",
        price: 5500,
        onSale: false,
        salePrice: 0,
        description: "Gorra ajustable de 6 paneles con visera plana. Estructura frontal rígida y logo bordado 3D Summer Queen. Cierre snapback de plástico de alta resistencia.",
        materials: "80% Acrílico, 20% Lana",
        sizes: ["Talle Único Ajustable"],
        colors: ["Negro", "Borgoña", "Verde Militar"],
        stock: 50,
        featured: true,
        image: generateMockSvg("accesorios", "Snapback Cap", "#a855f7"),
        images: [generateMockSvg("accesorios", "Snapback Cap", "#a855f7")]
    },
    {
        id: "prod-7",
        title: "Piluso Reversible Summer",
        category: "accesorios",
        price: 6800,
        onSale: false,
        salePrice: 0,
        description: "Sombrero bucket (piluso) totalmente reversible. Lado A estampado digital con patrón camuflado exclusivo, Lado B color negro liso con mini etiqueta tejida de marca.",
        materials: "100% Microfibra de Poliéster",
        sizes: ["M (57cm)", "L (59cm)"],
        colors: ["Camo/Negro", "Amarillo/Negro"],
        stock: 35,
        featured: false,
        image: generateMockSvg("accesorios", "Piluso Reversible", "#ec4899"),
        images: [generateMockSvg("accesorios", "Piluso Reversible", "#ec4899")]
    },
    {
        id: "prod-8",
        title: "Cartuchera Rolla Canvas",
        category: "accesorios",
        price: 4200,
        onSale: false,
        salePrice: 0,
        description: "Cartuchera enrollable ideal para marcadores, pinceles y útiles de dibujo. Cierre mediante cordón de cuero sintético y solapa protectora interna para evitar caídas de los objetos.",
        materials: "Lona reforzada, Tira de cuero",
        sizes: ["Talle Único"],
        colors: ["Kaki", "Denim", "Ocre"],
        stock: 40,
        featured: false,
        image: generateMockSvg("accesorios", "Cartuchera Rolla", "#06b6d4"),
        images: [generateMockSvg("accesorios", "Cartuchera Rolla", "#06b6d4")]
    }
];

const SEED_USERS = [
    {
        email: "admin@summerqueen.com",
        name: "Admin Summer Queen",
        password: "admin123", // En producción real, encriptado
        role: "admin",
        registeredAt: "2026-01-10T12:00:00Z"
    },
    {
        email: "ariel@gmail.com",
        name: "Ariel Confecciones",
        password: "user123",
        role: "client",
        registeredAt: "2026-05-15T10:30:00Z"
    }
];

const SEED_ORDERS = [
    {
        id: "ord-1001",
        client: {
            name: "Juan Pérez",
            email: "juan.perez@example.com",
            phone: "+54 9 11 9988-7766",
            address: "Av. Santa Fe 2340, 4B, CABA, Argentina"
        },
        items: [
            {
                productId: "prod-1",
                title: "Buzo Egresados Universe",
                price: 28500,
                quantity: 2,
                color: "Azul Marino",
                size: "L"
            },
            {
                productId: "prod-6",
                title: "Gorra Snapback Premium",
                price: 5500,
                quantity: 1,
                color: "Negro",
                size: "Talle Único Ajustable"
            }
        ],
        subtotal: 62500,
        discount: 6250, // Cupón del 10%
        tax: 11812.5, // 21% de IVA sobre el subtotal descontado
        total: 68062.5,
        paymentMethod: "credit_card",
        status: "delivered",
        date: "2026-05-28T14:20:00Z"
    },
    {
        id: "ord-1002",
        client: {
            name: "María Gómez",
            email: "maria.gomez@example.com",
            phone: "+54 9 341 555-1234",
            address: "Pellegrini 1500, Rosario, Santa Fe, Argentina"
        },
        items: [
            {
                productId: "prod-4",
                title: "Mochila Urban Tech Rolltop",
                price: 22000,
                quantity: 1,
                color: "Negro Mate",
                size: "25L"
            }
        ],
        subtotal: 22000,
        discount: 0,
        tax: 4620,
        total: 26620,
        paymentMethod: "bank_transfer",
        status: "inprogress",
        date: "2026-06-01T09:15:00Z"
    }
];

class StateManager {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // Auto-limpieza de caché local antigua si detecta el correo de desarrollo viejo
        const rawUsers = localStorage.getItem("sq_users");
        if (rawUsers && rawUsers.includes("admin@summerquen.com")) {
            localStorage.clear();
        }

        // Inicializar Productos
        if (!localStorage.getItem("sq_products")) {
            localStorage.setItem("sq_products", JSON.stringify(SEED_PRODUCTS));
        }
        // Inicializar Usuarios
        if (!localStorage.getItem("sq_users")) {
            localStorage.setItem("sq_users", JSON.stringify(SEED_USERS));
        }
        // Inicializar Pedidos
        if (!localStorage.getItem("sq_orders")) {
            localStorage.setItem("sq_orders", JSON.stringify(SEED_ORDERS));
        }
        // Inicializar Carrito vacío si no existe
        if (!localStorage.getItem("sq_cart")) {
            localStorage.setItem("sq_cart", JSON.stringify([]));
        }
        // Inicializar Sesión activa
        if (!localStorage.getItem("sq_session")) {
            localStorage.setItem("sq_session", JSON.stringify(null));
        }
        
        // Cupones de descuento en memoria
        this.coupons = {
            "SUMMER10": 0.10,
            "EGRESADOS20": 0.20,
            "ARIELFREE": 1.00 // Totalmente gratuito para tests
        };
        
        this.activeCoupon = localStorage.getItem("sq_coupon") || null;
    }

    // --- PRODUCTOS ---
    getProducts() {
        return JSON.parse(localStorage.getItem("sq_products"));
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    addProduct(product) {
        const products = this.getProducts();
        // Generar ID único
        product.id = "prod-" + Date.now();
        // Generar imágenes si no tiene
        if (!product.image) {
            product.image = generateMockSvg(product.category, product.title, "#e67e22");
        }
        if (!product.images || product.images.length === 0) {
            product.images = [product.image];
        }
        product.onSale = !!product.onSale;
        product.salePrice = parseFloat(product.salePrice) || 0;
        products.push(product);
        localStorage.setItem("sq_products", JSON.stringify(products));
        this.notifyChange("products");
        return product;
    }

    updateProduct(updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            const oldImage = products[index].image;
            // Preservar imágenes viejas si el formulario no las actualiza
            if (!updatedProduct.image && oldImage) {
                updatedProduct.image = oldImage;
            }
            
            // Si la imagen principal cambió, actualizar la galería con la nueva imagen
            if (updatedProduct.image && updatedProduct.image !== oldImage) {
                updatedProduct.images = [updatedProduct.image];
            } else if ((!updatedProduct.images || updatedProduct.images.length === 0) && products[index].images) {
                updatedProduct.images = products[index].images;
            }

            updatedProduct.onSale = !!updatedProduct.onSale;
            updatedProduct.salePrice = parseFloat(updatedProduct.salePrice) || 0;
            
            products[index] = { ...products[index], ...updatedProduct };
            localStorage.setItem("sq_products", JSON.stringify(products));
            this.notifyChange("products");
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        if (filtered.length !== products.length) {
            localStorage.setItem("sq_products", JSON.stringify(filtered));
            this.notifyChange("products");
            return true;
        }
        return false;
    }

    // --- CARRITO ---
    getCart() {
        return JSON.parse(localStorage.getItem("sq_cart"));
    }

    saveCart(cart) {
        localStorage.setItem("sq_cart", JSON.stringify(cart));
        this.notifyChange("cart");
    }

    addToCart(productId, qty = 1, color = "", size = "") {
        const cart = this.getCart();
        const product = this.getProductById(productId);
        if (!product) return false;

        // Comprobar si ya existe la misma variante del producto
        const existingItem = cart.find(item => 
            item.productId === productId && 
            item.color === color && 
            item.size === size
        );

        if (existingItem) {
            existingItem.quantity += parseInt(qty);
        } else {
            const price = (product.onSale && product.salePrice > 0) ? product.salePrice : product.price;
            cart.push({
                productId,
                title: product.title,
                price: price,
                image: product.image,
                category: product.category,
                quantity: parseInt(qty),
                color,
                size
            });
        }

        this.saveCart(cart);
        return true;
    }

    updateCartQty(productId, color, size, newQty) {
        let cart = this.getCart();
        const item = cart.find(i => i.productId === productId && i.color === color && i.size === size);
        if (item) {
            item.quantity = parseInt(newQty);
            if (item.quantity <= 0) {
                cart = cart.filter(i => !(i.productId === productId && i.color === color && i.size === size));
            }
            this.saveCart(cart);
            return true;
        }
        return false;
    }

    removeFromCart(productId, color, size) {
        let cart = this.getCart();
        cart = cart.filter(i => !(i.productId === productId && i.color === color && i.size === size));
        this.saveCart(cart);
        return true;
    }

    clearCart() {
        this.saveCart([]);
        localStorage.removeItem("sq_coupon");
        this.activeCoupon = null;
    }

    // --- CUPONES ---
    applyCoupon(code) {
        const formattedCode = code.trim().toUpperCase();
        if (this.coupons.hasOwnProperty(formattedCode)) {
            this.activeCoupon = formattedCode;
            localStorage.setItem("sq_coupon", formattedCode);
            this.notifyChange("cart");
            return { success: true, discount: this.coupons[formattedCode] };
        }
        return { success: false, message: "Código inválido o vencido" };
    }

    getActiveCoupon() {
        return this.activeCoupon;
    }

    getDiscountRate() {
        if (!this.activeCoupon) return 0;
        return this.coupons[this.activeCoupon] || 0;
    }

    getCartTotals() {
        const cart = this.getCart();
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const discountRate = this.getDiscountRate();
        const discount = subtotal * discountRate;
        const netSubtotal = subtotal - discount;
        const tax = netSubtotal * 0.21; // 21% IVA en Argentina
        const total = netSubtotal + tax;

        return {
            subtotal,
            discount,
            tax,
            total,
            itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
        };
    }

    // --- ORDENES / PEDIDOS ---
    getOrders() {
        return JSON.parse(localStorage.getItem("sq_orders"));
    }

    createOrder(clientInfo, paymentMethod) {
        const cart = this.getCart();
        if (cart.length === 0) return null;

        const totals = this.getCartTotals();
        const orders = this.getOrders();
        
        // Crear nueva orden
        const newOrder = {
            id: "ord-" + (1000 + orders.length + 1),
            client: clientInfo,
            items: [...cart],
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            paymentMethod,
            status: "pending",
            date: new Date().toISOString()
        };

        orders.push(newOrder);
        localStorage.setItem("sq_orders", JSON.stringify(orders));

        // Descontar Stock de los productos
        const products = this.getProducts();
        newOrder.items.forEach(orderItem => {
            const product = products.find(p => p.id === orderItem.productId);
            if (product) {
                product.stock = Math.max(0, product.stock - orderItem.quantity);
            }
        });
        localStorage.setItem("sq_products", JSON.stringify(products));

        // Vaciar Carrito
        this.clearCart();
        
        this.notifyChange("orders");
        this.notifyChange("products");

        return newOrder;
    }

    updateOrderStatus(orderId, newStatus) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem("sq_orders", JSON.stringify(orders));
            this.notifyChange("orders");
            return true;
        }
        return false;
    }

    deleteOrder(orderId) {
        const orders = this.getOrders();
        const filtered = orders.filter(o => o.id !== orderId);
        if (filtered.length !== orders.length) {
            localStorage.setItem("sq_orders", JSON.stringify(filtered));
            this.notifyChange("orders");
            return true;
        }
        return false;
    }

    // --- SESIONES & USUARIOS ---
    getUsers() {
        return JSON.parse(localStorage.getItem("sq_users"));
    }

    register(email, name, password) {
        const users = this.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: "El correo ya está registrado" };
        }

        const newUser = {
            email: email.toLowerCase(),
            name,
            password,
            role: "client",
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem("sq_users", JSON.stringify(users));
        return { success: true, user: newUser };
    }

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            const sessionUser = { email: user.email, name: user.name, role: user.role };
            localStorage.setItem("sq_session", JSON.stringify(sessionUser));
            this.notifyChange("session");
            return { success: true, user: sessionUser };
        }
        return { success: false, message: "Email o contraseña incorrectos" };
    }

    logout() {
        localStorage.setItem("sq_session", JSON.stringify(null));
        this.notifyChange("session");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("sq_session"));
    }

    isAdminLoggedIn() {
        const user = this.getCurrentUser();
        return user && user.role === "admin";
    }

    // --- REPORTES Y METRICAS ---
    getStats() {
        const orders = this.getOrders();
        const products = this.getProducts();
        const users = this.getUsers();
        
        // Ventas totales e ingresos
        const totalSales = orders.length;
        const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
        
        // Tickets promedio
        const avgTicket = totalSales > 0 ? (totalRevenue / totalSales) : 0;
        
        // Clientes registrados
        const totalClients = users.filter(u => u.role === "client").length;
        
        // Ranking de productos más vendidos
        const productSales = {};
        orders.forEach(o => {
            if (o.status !== 'cancelled') {
                o.items.forEach(item => {
                    productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
                });
            }
        });
        
        const sortedProducts = Object.entries(productSales)
            .map(([id, qty]) => {
                const prod = products.find(p => p.id === id);
                return {
                    title: prod ? prod.title : "Producto Eliminado",
                    quantity: qty,
                    revenue: qty * (prod ? prod.price : 0)
                };
            })
            .sort((a, b) => b.quantity - a.quantity);

        // Ventas por día (últimos 7 días)
        const dailySales = {};
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailySales[dateStr] = 0;
        }

        orders.forEach(o => {
            if (o.status !== 'cancelled') {
                const dateStr = o.date.split('T')[0];
                if (dailySales.hasOwnProperty(dateStr)) {
                    dailySales[dateStr] += o.total;
                }
            }
        });

        return {
            totalSales,
            totalRevenue,
            avgTicket,
            totalClients,
            topProducts: sortedProducts.slice(0, 5),
            dailySales: Object.entries(dailySales).map(([date, amount]) => ({ date, amount }))
        };
    }

    // --- EVENT SYSTEM (Sencillo Pub/Sub para actualizar UI al instante) ---
    listeners = {};

    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    notifyChange(event) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb());
        }
    }
}

// Exportar globalmente como 'state' para simplificar acceso en archivos
window.state = new StateManager();
