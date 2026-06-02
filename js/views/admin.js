/**
 * SUMMERQUEN - VISTA PANEL DE ADMINISTRACIÓN (ADMIN DASHBOARD)
 */

window.views.admin = {
    render: function(container, param, query) {
        // Verificar si el administrador ha iniciado sesión
        if (!window.state.isAdminLoggedIn()) {
            this.renderLoginForm(container);
            return;
        }

        // Estado de la pestaña activa en el panel
        this.activeTab = "dashboard"; // dashboard | products | orders | users
        this.editingProductId = null; // Para saber si editamos o creamos producto

        this.renderDashboardLayout(container);
    },

    // 1. RENDER DE FORMULARIO DE LOGIN
    renderLoginForm: function(container) {
        container.innerHTML = `
            <div class="container" style="min-height: 600px; display: flex; align-items: center; justify-content: center;">
                <div class="admin-login-card">
                    <h2>Panel de Control</h2>
                    <p>Ingresa tus credenciales de administrador para gestionar la tienda.</p>
                    
                    <form id="adminLoginForm" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div class="form-group">
                            <label class="form-label" for="loginEmail">Correo Electrónico</label>
                            <input type="email" id="loginEmail" class="form-control" placeholder="admin@summerqueen.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="loginPassword">Contraseña</label>
                            <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">
                            Iniciar Sesión <i data-lucide="log-in" style="width: 16px; height: 16px;"></i>
                        </button>
                    </form>
                    
                    <div style="margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: var(--color-text-muted); background-color: var(--color-bg-alt); padding: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border);">
                        <strong>Credenciales Demo:</strong><br>
                        Email: <code>admin@summerqueen.com</code><br>
                        Password: <code>admin123</code>
                    </div>
                </div>
            </div>
        `;

        const form = document.getElementById("adminLoginForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const pass = document.getElementById("loginPassword").value;
            
            const res = window.state.login(email, pass);
            if (res.success) {
                window.components.showToast("Acceso concedido", "success");
                // Re-renderizar la vista de administración
                this.render(container);
            } else {
                window.components.showToast(res.message, "error");
            }
        });

        if (window.lucide) window.lucide.createIcons();
    },

    // 2. RENDER DE LAYOUT PRINCIPAL DEL DASHBOARD
    renderDashboardLayout: function(container) {
        container.innerHTML = `
            <div class="container admin-view">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem; margin-bottom: 2rem;">
                    <div>
                        <h1 style="font-family: var(--font-heading); font-size: 2.5rem;">Administración</h1>
                        <p style="color: var(--color-text-muted); font-size: 0.95rem;">Gestiona tus productos, pedidos, clientes y reportes de confección.</p>
                    </div>
                    <button class="btn btn-outline btn-sm" id="adminLogoutBtn">
                        Cerrar Sesión <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>

                <div class="admin-layout">
                    <!-- NAVEGACIÓN LATERAL -->
                    <aside class="admin-nav">
                        <button class="admin-nav-btn active" data-tab="dashboard">
                            <i data-lucide="layout-dashboard"></i> Dashboard
                        </button>
                        <button class="admin-nav-btn" data-tab="products">
                            <i data-lucide="package"></i> Productos
                        </button>
                        <button class="admin-nav-btn" data-tab="orders">
                            <i data-lucide="clipboard-list"></i> Pedidos
                        </button>
                        <button class="admin-nav-btn" data-tab="users">
                            <i data-lucide="users"></i> Clientes
                        </button>
                    </aside>

                    <!-- CONTENIDO DE PESTAÑA -->
                    <main class="admin-content" id="adminTabContent">
                        <!-- Render dinámico según la pestaña activa -->
                    </main>
                </div>
            </div>

            <!-- MODAL CRUD DE PRODUCTOS (OCULTO POR DEFECTO) -->
            <div class="admin-modal-overlay" id="productModalOverlay">
                <div class="admin-modal">
                    <div class="admin-modal-header">
                        <h3 id="modalTitle">Nuevo Producto</h3>
                        <button class="icon-btn" id="closeProductModalBtn">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <form id="productCrudForm">
                        <div class="admin-modal-body">
                            <div class="form-group">
                                <label class="form-label" for="prodTitle">Título del Producto *</label>
                                <input type="text" id="prodTitle" class="form-control" placeholder="Buzo Egresados Andromeda" required>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="prodCategory">Categoría *</label>
                                    <select id="prodCategory" class="form-control" required>
                                        <option value="egresados">Ropa para Egresados</option>
                                        <option value="mochilas">Mochilas de Diseño</option>
                                        <option value="accesorios">Accesorios</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="prodPrice">Precio ($) *</label>
                                    <input type="number" id="prodPrice" class="form-control" placeholder="24500" min="0" required>
                                </div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="prodStock">Stock Inicial *</label>
                                    <input type="number" id="prodStock" class="form-control" placeholder="30" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="prodFeatured">Destacado</label>
                                    <select id="prodFeatured" class="form-control">
                                        <option value="false">No</option>
                                        <option value="true">Sí (Aparece en inicio)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="checkbox-label" style="margin-top: 1.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <input type="checkbox" id="prodOnSale">
                                        ¿Aplicar Oferta?
                                    </label>
                                </div>
                                <div class="form-group" id="prodSalePriceGroup" style="display: none;">
                                    <label class="form-label" for="prodSalePrice">Precio de Oferta ($) *</label>
                                    <input type="number" id="prodSalePrice" class="form-control" placeholder="19600" min="0">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prodImageFile">Foto del Producto (Dejar vacío para usar predeterminada)</label>
                                <input type="file" id="prodImageFile" class="form-control" accept="image/*" style="padding: 0.4rem 0.6rem;">
                                <div id="prodImagePreviewContainer" style="margin-top: 0.5rem; display: none; align-items: center; gap: 1rem;">
                                    <img id="prodImagePreview" src="" alt="Vista previa" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border);">
                                    <span style="font-size: 0.8rem; color: var(--color-text-muted);">Imagen cargada</span>
                                </div>
                                <input type="hidden" id="prodImageBase64">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prodDesc">Descripción Detallada *</label>
                                <textarea id="prodDesc" class="form-control" rows="3" placeholder="Detalles de materiales y confección..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prodMaterials">Ficha Técnica: Materiales</label>
                                <input type="text" id="prodMaterials" class="form-control" placeholder="80% Algodón, 20% Fibras Sintéticas">
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="prodColors">Colores (Separados por coma)</label>
                                    <input type="text" id="prodColors" class="form-control" placeholder="Negro, Azul Marino, Gris">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="prodSizes">Talles (Separados por coma)</label>
                                    <input type="text" id="prodSizes" class="form-control" placeholder="S, M, L, XL">
                                </div>
                            </div>
                        </div>
                        <div class="admin-modal-footer">
                            <button type="button" class="btn btn-outline btn-sm" id="cancelProductBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary btn-sm" id="submitProductBtn">Guardar Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Atar eventos de navegación y cerrar sesión
        this.initAdminLayoutEvents(container);
        
        // Cargar por defecto la primera pestaña
        this.switchTab("dashboard");
    },

    initAdminLayoutEvents: function(container) {
        const logoutBtn = document.getElementById("adminLogoutBtn");
        const navButtons = document.querySelectorAll(".admin-nav-btn");

        // Evento Cerrar Sesión
        logoutBtn.addEventListener("click", () => {
            window.state.logout();
            window.components.showToast("Sesión cerrada", "info");
            this.render(container); // Volver al login
        });

        // Eventos Navegación Pestañas
        navButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                navButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const tab = btn.getAttribute("data-tab");
                this.switchTab(tab);
            });
        });

        // Suscribirse a cambios en productos/pedidos/usuarios para auto-actualizar tab activo si cambia
        window.state.subscribe("products", () => {
            if (this.activeTab === "products" || this.activeTab === "dashboard") {
                this.switchTab(this.activeTab);
            }
        });
        window.state.subscribe("orders", () => {
            if (this.activeTab === "orders" || this.activeTab === "dashboard") {
                this.switchTab(this.activeTab);
            }
        });

        const closeModal = () => {
            modalOverlay.classList.remove("active");
            crudForm.reset();
            this.editingProductId = null;
            
            // Limpiar inputs agregados y vista previa
            document.getElementById("prodImageBase64").value = "";
            document.getElementById("prodImagePreviewContainer").style.display = "none";
            document.getElementById("prodImageFile").value = "";
            
            document.getElementById("prodSalePriceGroup").style.display = "none";
            const salePriceInput = document.getElementById("prodSalePrice");
            salePriceInput.value = "";
            salePriceInput.disabled = true;
            salePriceInput.required = false;
        };

        // Escuchar subida de archivo para la foto
        const fileInput = document.getElementById("prodImageFile");
        const base64Input = document.getElementById("prodImageBase64");
        const previewContainer = document.getElementById("prodImagePreviewContainer");
        const previewImage = document.getElementById("prodImagePreview");

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // Limitado a 2MB
                    window.components.showToast("La imagen debe ser menor a 2MB para no exceder almacenamiento", "error");
                    fileInput.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const base64 = evt.target.result;
                    base64Input.value = base64;
                    previewImage.src = base64;
                    previewContainer.style.display = "flex";
                };
                reader.readAsDataURL(file);
            }
        });

        // Escuchar checkbox de Oferta para habilitar el input de precio correspondiente
        const onSaleCheckbox = document.getElementById("prodOnSale");
        const salePriceGroup = document.getElementById("prodSalePriceGroup");
        const salePriceInput = document.getElementById("prodSalePrice");

        onSaleCheckbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                salePriceGroup.style.display = "block";
                salePriceInput.disabled = false;
                salePriceInput.required = true;
                // Sugerir un precio con descuento del 20% si está vacío
                if (!salePriceInput.value) {
                    const originalPrice = parseFloat(document.getElementById("prodPrice").value) || 0;
                    if (originalPrice > 0) {
                        salePriceInput.value = Math.round(originalPrice * 0.80);
                    }
                }
            } else {
                salePriceGroup.style.display = "none";
                salePriceInput.disabled = true;
                salePriceInput.required = false;
                salePriceInput.value = "";
            }
        });

        closeModalBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        crudForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleProductSubmit(closeModal);
        });
    },

    switchTab: function(tabName) {
        this.activeTab = tabName;
        const tabContentEl = document.getElementById("adminTabContent");
        if (!tabContentEl) return;

        if (tabName === "dashboard") {
            this.renderTabDashboard(tabContentEl);
        } else if (tabName === "products") {
            this.renderTabProducts(tabContentEl);
        } else if (tabName === "orders") {
            this.renderTabOrders(tabContentEl);
        } else if (tabName === "users") {
            this.renderTabUsers(tabContentEl);
        }

        if (window.lucide) window.lucide.createIcons();
    },

    // 3. PESTAÑA: DASHBOARD & REPORTES
    renderTabDashboard: function(element) {
        const stats = window.state.getStats();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

        // Encontrar max ventas diarias para escala del gráfico
        const maxDailySales = Math.max(...stats.dailySales.map(d => d.amount), 50000);

        // Construir gráfico de barras
        let chartColsHtml = "";
        stats.dailySales.forEach(day => {
            // Formatear fecha corta dd/mm
            const dateParts = day.date.split('-');
            const dateFormatted = dateParts.length >= 3 ? `${dateParts[2]}/${dateParts[1]}` : day.date;
            
            // Altura de barra en %
            const heightPercent = maxDailySales > 0 ? (day.amount / maxDailySales) * 100 : 0;
            
            chartColsHtml += `
                <div class="bar-col">
                    <span class="bar-val">${day.amount > 0 ? formatter.format(day.amount) : '$0'}</span>
                    <div class="bar-fill" style="height: ${Math.max(heightPercent, 3)}%;"></div>
                    <span class="bar-lbl">${dateFormatted}</span>
                </div>
            `;
        });

        // Tabla de más vendidos
        let topProductsHtml = "";
        if (stats.topProducts.length === 0) {
            topProductsHtml = `<tr><td colspan="3" style="text-align:center; color:var(--color-text-muted);">Sin ventas registradas aún.</td></tr>`;
        } else {
            stats.topProducts.forEach((prod, idx) => {
                topProductsHtml += `
                    <tr>
                        <td><strong>#${idx + 1}</strong> ${prod.title}</td>
                        <td style="text-align: center;">${prod.quantity} u.</td>
                        <td>${formatter.format(prod.revenue)}</td>
                    </tr>
                `;
            });
        }

        element.innerHTML = `
            <!-- Tarjetas de métricas rápidas (KPIs) -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h4>Ingresos Totales</h4>
                        <div class="stat-value">${formatter.format(stats.totalRevenue)}</div>
                    </div>
                    <div class="stat-icon">
                        <i data-lucide="dollar-sign"></i>
                    </div>
                </div>

                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h4>Pedidos Realizados</h4>
                        <div class="stat-value">${stats.totalSales}</div>
                    </div>
                    <div class="stat-icon" style="background-color: var(--color-success-bg); color: var(--color-success);">
                        <i data-lucide="shopping-bag"></i>
                    </div>
                </div>

                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h4>Clientes</h4>
                        <div class="stat-value">${stats.totalClients}</div>
                    </div>
                    <div class="stat-icon" style="background-color: var(--color-info-bg); color: var(--color-info);">
                        <i data-lucide="users"></i>
                    </div>
                </div>

                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h4>Ticket Promedio</h4>
                        <div class="stat-value">${formatter.format(stats.avgTicket)}</div>
                    </div>
                    <div class="stat-icon" style="background-color: var(--color-warning-bg); color: var(--color-warning);">
                        <i data-lucide="trending-up"></i>
                    </div>
                </div>
            </div>

            <div class="admin-reports-panel">
                <!-- Gráfico de Ventas -->
                <div class="chart-card">
                    <h3>Ventas de los últimos 7 días</h3>
                    <div class="bar-chart-sim">
                        ${chartColsHtml}
                    </div>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted); text-align: center; margin-top: 1rem;">
                        Gráfico interactivo de facturación expresada en pesos argentinos (ARS).
                    </p>
                </div>

                <!-- Ranking Productos más vendidos -->
                <div class="chart-card" style="display: flex; flex-direction: column;">
                    <h3>Productos Estrella</h3>
                    <div style="flex-grow:1; display:flex; align-items:center;">
                        <table class="admin-table" style="font-size: 0.9rem;">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th style="text-align: center;">Cantidad</th>
                                    <th>Facturado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${topProductsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // 4. PESTAÑA: GESTIÓN DE PRODUCTOS (CRUD)
    renderTabProducts: function(element) {
        const products = window.state.getProducts();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

        let tableRowsHtml = "";
        products.forEach(p => {
            tableRowsHtml += `
                <tr>
                    <td style="width: 70px;">
                        <img src="${p.image}" alt="${p.title}" style="width: 50px; height: 50px; border-radius: var(--border-radius-sm); object-fit: cover; background-color: var(--color-bg-alt);">
                    </td>
                    <td>
                        <strong>${p.title}</strong>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">ID: ${p.id}</div>
                    </td>
                    <td><span class="status-badge" style="background-color: var(--color-primary-light); color: var(--color-primary);">${p.category}</span></td>
                    <td><strong>${formatter.format(p.price)}</strong></td>
                    <td>
                        <span style="font-weight: 600; color: ${p.stock <= 5 ? 'var(--color-danger)' : 'inherit'}">
                            ${p.stock} u.
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline btn-sm edit-prod-btn" data-id="${p.id}" style="padding: 0.4rem 0.8rem;" title="Editar">
                                <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-prod-btn" data-id="${p.id}" style="padding: 0.4rem 0.8rem;" title="Eliminar">
                                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        element.innerHTML = `
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Listado de Inventario</h3>
                    <button class="btn btn-primary btn-sm" id="openAddProductModalBtn">
                        <i data-lucide="plus"></i> Agregar Producto
                    </button>
                </div>
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Atar manejadores de eventos específicos de productos
        this.initProductsTabEvents();
    },

    initProductsTabEvents: function() {
        const addBtn = document.getElementById("openAddProductModalBtn");
        const editButtons = document.querySelectorAll(".edit-prod-btn");
        const deleteButtons = document.querySelectorAll(".delete-prod-btn");
        
        const modalOverlay = document.getElementById("productModalOverlay");
        const modalTitle = document.getElementById("modalTitle");

        // Abrir modal para crear
        addBtn.addEventListener("click", () => {
            modalTitle.textContent = "Nuevo Producto";
            this.editingProductId = null;
            
            // Limpiar inputs adicionales
            document.getElementById("prodImageBase64").value = "";
            document.getElementById("prodImagePreviewContainer").style.display = "none";
            document.getElementById("prodImageFile").value = "";
            
            document.getElementById("prodOnSale").checked = false;
            document.getElementById("prodSalePriceGroup").style.display = "none";
            document.getElementById("prodSalePrice").value = "";
            document.getElementById("prodSalePrice").disabled = true;
            document.getElementById("prodSalePrice").required = false;

            modalOverlay.classList.add("active");
        });

        // Abrir modal para editar (cargar datos previos)
        editButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const prod = window.state.getProductById(id);
                
                if (prod) {
                    this.editingProductId = id;
                    modalTitle.textContent = `Editar: ${prod.title}`;

                    document.getElementById("prodTitle").value = prod.title;
                    document.getElementById("prodCategory").value = prod.category;
                    document.getElementById("prodPrice").value = prod.price;
                    document.getElementById("prodStock").value = prod.stock;
                    document.getElementById("prodFeatured").value = prod.featured ? "true" : "false";
                    document.getElementById("prodDesc").value = prod.description;
                    document.getElementById("prodMaterials").value = prod.materials || "";
                    document.getElementById("prodColors").value = prod.colors ? prod.colors.join(", ") : "";
                    document.getElementById("prodSizes").value = prod.sizes ? prod.sizes.join(", ") : "";

                    // Cargar estado de oferta
                    const onSale = !!prod.onSale;
                    document.getElementById("prodOnSale").checked = onSale;
                    const salePriceGroup = document.getElementById("prodSalePriceGroup");
                    const salePriceInput = document.getElementById("prodSalePrice");
                    if (onSale) {
                        salePriceGroup.style.display = "block";
                        salePriceInput.value = prod.salePrice || "";
                        salePriceInput.disabled = false;
                        salePriceInput.required = true;
                    } else {
                        salePriceGroup.style.display = "none";
                        salePriceInput.value = "";
                        salePriceInput.disabled = true;
                        salePriceInput.required = false;
                    }

                    // Cargar vista previa de foto actual
                    if (prod.image) {
                        document.getElementById("prodImageBase64").value = prod.image;
                        document.getElementById("prodImagePreview").src = prod.image;
                        document.getElementById("prodImagePreviewContainer").style.display = "flex";
                    } else {
                        document.getElementById("prodImageBase64").value = "";
                        document.getElementById("prodImagePreviewContainer").style.display = "none";
                    }

                    modalOverlay.classList.add("active");
                }
            });
        });

        // Eliminar producto
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const prod = window.state.getProductById(id);
                if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${prod.title}"?`)) {
                    const deleted = window.state.deleteProduct(id);
                    if (deleted) {
                        window.components.showToast("Producto eliminado de la base de datos", "success");
                        this.switchTab("products");
                    }
                }
            });
        });
    },

    handleProductSubmit: function(closeModalCallback) {
        // Capturar datos del formulario
        const colorVal = document.getElementById("prodColors").value;
        const sizeVal = document.getElementById("prodSizes").value;
        const onSale = document.getElementById("prodOnSale").checked;

        const productData = {
            title: document.getElementById("prodTitle").value,
            category: document.getElementById("prodCategory").value,
            price: parseFloat(document.getElementById("prodPrice").value),
            onSale: onSale,
            salePrice: onSale ? parseFloat(document.getElementById("prodSalePrice").value) : 0,
            stock: parseInt(document.getElementById("prodStock").value),
            featured: document.getElementById("prodFeatured").value === "true",
            description: document.getElementById("prodDesc").value,
            materials: document.getElementById("prodMaterials").value,
            colors: colorVal ? colorVal.split(",").map(c => c.trim()) : [],
            sizes: sizeVal ? sizeVal.split(",").map(s => s.trim()) : [],
            image: document.getElementById("prodImageBase64").value || ""
        };

        if (this.editingProductId) {
            // EDITAR
            productData.id = this.editingProductId;
            const success = window.state.updateProduct(productData);
            if (success) {
                window.components.showToast("Producto actualizado correctamente", "success");
            }
        } else {
            // CREAR
            window.state.addProduct(productData);
            window.components.showToast("Producto añadido al catálogo", "success");
        }

        closeModalCallback();
        this.switchTab("products");
    },

    // 5. PESTAÑA: CONTROL DE PEDIDOS
    renderTabOrders: function(element) {
        const orders = window.state.getOrders();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

        let tableRowsHtml = "";
        orders.forEach(o => {
            // Formatear Fecha
            const orderDate = new Date(o.date).toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            tableRowsHtml += `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>
                        <strong>${o.client.name}</strong>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${o.client.email}</div>
                    </td>
                    <td>${orderDate} hs.</td>
                    <td>
                        <span style="font-size: 0.8rem;">
                            ${o.paymentMethod === "credit_card" ? "💳 Tarjeta" : o.paymentMethod === "bank_transfer" ? "🏛️ Transf." : "🌐 PayPal"}
                        </span>
                    </td>
                    <td><strong>${formatter.format(o.total)}</strong></td>
                    <td>
                        <select class="form-control status-select status-${o.status}" data-order-id="${o.id}" style="padding:0.3rem 0.5rem; font-size:0.8rem; font-weight:600; width:auto; border-radius: var(--border-radius-sm);">
                            <option value="pending" class="status-pending" ${o.status === "pending" ? "selected" : ""}>Pendiente</option>
                            <option value="inprogress" class="status-inprogress" ${o.status === "inprogress" ? "selected" : ""}>En Proceso</option>
                            <option value="shipped" class="status-shipped" ${o.status === "shipped" ? "selected" : ""}>Enviado</option>
                            <option value="delivered" class="status-delivered" ${o.status === "delivered" ? "selected" : ""}>Entregado</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-outline btn-sm view-order-btn" data-id="${o.id}" style="padding: 0.4rem 0.8rem;" title="Detalles">
                            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        element.innerHTML = `
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Pedidos Registrados</h3>
                </div>
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Pago</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- MODAL DETALLES DEL PEDIDO (OCULTO) -->
            <div class="admin-modal-overlay" id="orderModalOverlay">
                <div class="admin-modal" style="width: 500px;">
                    <div class="admin-modal-header">
                        <h3>Detalle del Pedido</h3>
                        <button class="icon-btn" id="closeOrderModalBtn">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="admin-modal-body" id="orderModalBody">
                        <!-- Carga dinámica -->
                    </div>
                    <div class="admin-modal-footer">
                        <button class="btn btn-primary btn-sm" id="confirmOrderModalBtn">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        this.initOrdersTabEvents();
    },

    initOrdersTabEvents: function() {
        const statusSelects = document.querySelectorAll(".status-select");
        const viewButtons = document.querySelectorAll(".view-order-btn");
        
        const modalOverlay = document.getElementById("orderModalOverlay");
        const modalBody = document.getElementById("orderModalBody");
        const closeBtn = document.getElementById("closeOrderModalBtn");
        const confirmBtn = document.getElementById("confirmOrderModalBtn");

        // Cambiar estado del pedido
        statusSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const orderId = select.getAttribute("data-order-id");
                const newStatus = select.value;
                
                const updated = window.state.updateOrderStatus(orderId, newStatus);
                if (updated) {
                    window.components.showToast(`Estado de ${orderId} modificado`, "success");
                    this.switchTab("orders");
                }
            });
        });

        // Ver detalle del pedido en modal
        viewButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const orders = window.state.getOrders();
                const o = orders.find(ord => ord.id === id);

                if (o) {
                    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });
                    
                    let itemsHtml = "";
                    o.items.forEach(it => {
                        itemsHtml += `
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; padding:0.5rem 0; border-bottom:1px solid var(--color-border);">
                                <div>
                                    <strong>${it.title}</strong>
                                    <div style="font-size:0.75rem; color:var(--color-text-muted);">
                                        Cant: ${it.quantity} | Talle: ${it.size || '-'} | Color: ${it.color || '-'}
                                    </div>
                                </div>
                                <strong>${formatter.format(it.price * it.quantity)}</strong>
                            </div>
                        `;
                    });

                    modalBody.innerHTML = `
                        <div style="margin-bottom:1.5rem;">
                            <h4 style="margin-bottom:0.5rem; font-size:1.05rem;">Comprador</h4>
                            <p style="font-size:0.9rem;"><strong>Nombre:</strong> ${o.client.name}</p>
                            <p style="font-size:0.9rem;"><strong>Email:</strong> ${o.client.email}</p>
                            <p style="font-size:0.9rem;"><strong>Teléfono:</strong> ${o.client.phone}</p>
                            <p style="font-size:0.9rem;"><strong>Dirección:</strong> ${o.client.address}</p>
                        </div>
                        <div style="margin-bottom:1.5rem;">
                            <h4 style="margin-bottom:0.5rem; font-size:1.05rem;">Artículos pedidos</h4>
                            ${itemsHtml}
                        </div>
                        <div>
                            <div class="cart-totals"><span>Subtotal:</span><span>${formatter.format(o.subtotal)}</span></div>
                            ${o.discount > 0 ? `<div class="cart-totals discount-row"><span>Descuento:</span><span>-${formatter.format(o.discount)}</span></div>` : ''}
                            <div class="cart-totals"><span>IVA (21%):</span><span>${formatter.format(o.tax)}</span></div>
                            <div class="cart-totals total-row"><span>Total:</span><span>${formatter.format(o.total)}</span></div>
                        </div>
                    `;

                    modalOverlay.classList.add("active");
                    if (window.lucide) window.lucide.createIcons();
                }
            });
        });

        // Cerrar detalles
        const hideModal = () => modalOverlay.classList.remove("active");
        closeBtn.addEventListener("click", hideModal);
        confirmBtn.addEventListener("click", hideModal);
    },

    // 6. PESTAÑA: GESTIÓN DE USUARIOS
    renderTabUsers: function(element) {
        const users = window.state.getUsers();

        let tableRowsHtml = "";
        users.forEach(u => {
            const regDate = new Date(u.registeredAt).toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });

            tableRowsHtml += `
                <tr>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td>
                        <span class="status-badge" style="background-color: ${u.role === 'admin' ? 'var(--color-danger-bg)' : 'var(--color-info-bg)'}; color: ${u.role === 'admin' ? 'var(--color-danger)' : 'var(--color-info)'};">
                            ${u.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                    </td>
                    <td>${regDate}</td>
                </tr>
            `;
        });

        element.innerHTML = `
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Clientes & Colaboradores</h3>
                </div>
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol / Rango</th>
                                <th>Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};
