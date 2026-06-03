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
                <div class="admin-header-row">
                    <div>
                        <h1 style="font-family: var(--font-heading); font-size: 2.5rem; margin: 0;">Administración</h1>
                        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-top: 0.25rem;">Gestiona tus productos, pedidos, clientes y reportes de confección.</p>
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
                        <button class="admin-nav-btn" data-tab="messages">
                            <i data-lucide="mail"></i> Mensajes <span class="messages-badge" id="unreadMessagesBadge" style="background: var(--color-danger); color: white; border-radius: 10px; padding: 0.1rem 0.4rem; font-size: 0.75rem; margin-left: 0.5rem; display: none;">0</span>
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
                                    <label class="form-label" for="prodStock">Stock Total (Autocalculado) *</label>
                                    <input type="number" id="prodStock" class="form-control" placeholder="Se calcula de las variantes" min="0" readonly required>
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
                                <label class="form-label" style="font-weight: 600;">Fotos del Producto (Hasta 6 fotos. La 1ra será la Portada)</label>
                                <div class="gallery-upload-container" style="border: 2px dashed var(--color-border); border-radius: var(--border-radius-md); padding: 1.25rem; text-align: center; background-color: var(--color-bg-alt); position: relative; cursor: pointer; transition: border-color 0.2s, background-color 0.2s;">
                                    <input type="file" id="prodGalleryFileInput" class="form-control" accept="image/*" multiple style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 2;">
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--color-text-muted);">
                                        <i data-lucide="image" style="width: 24px; height: 24px; color: var(--color-primary);"></i>
                                        <span id="prodGalleryUploadText" style="font-size: 0.85rem; font-weight: 500;">Hacé clic o arrastrá para subir fotos</span>
                                        <span style="font-size: 0.75rem;">(Máx. 6 fotos - Menores a 2MB cada una)</span>
                                    </div>
                                </div>
                                <div id="prodGalleryPreviews" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
                                    <!-- Miniaturas de fotos cargadas -->
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prodDesc">Descripción Detallada *</label>
                                <textarea id="prodDesc" class="form-control" rows="3" placeholder="Detalles de materiales y confección..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prodMaterials">Ficha Técnica: Materiales</label>
                                <input type="text" id="prodMaterials" class="form-control" placeholder="80% Algodón, 20% Fibras Sintéticas">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="prodSizes">Talles (Autocalculado)</label>
                                <input type="text" id="prodSizes" class="form-control" placeholder="Se calcula de las variantes" readonly>
                            </div>

                            <div style="border-top: 1px solid var(--color-border); padding-top: 1.25rem; margin-top: 1.25rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                                    <label class="form-label" style="font-weight: 700; margin: 0; color: var(--color-primary);">Variantes de Color *</label>
                                    <button type="button" class="btn btn-outline btn-xs" id="addVariantRowBtn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Añadir Color
                                    </button>
                                </div>
                                <div id="variantsContainer" style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 250px; overflow-y: auto; padding-right: 0.25rem; margin-bottom: 1rem;">
                                    <!-- Filas de variantes de color -->
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
        
        // Cargar badge inicial de mensajes no leídos
        this.updateUnreadMessagesBadge();
        
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
        window.state.subscribe("messages", () => {
            this.updateUnreadMessagesBadge();
            if (this.activeTab === "messages") {
                this.switchTab(this.activeTab);
            }
        });

        // Eventos del Modal
        const modalOverlay = document.getElementById("productModalOverlay");
        const closeModalBtn = document.getElementById("closeProductModalBtn");
        const cancelBtn = document.getElementById("cancelProductBtn");
        const crudForm = document.getElementById("productCrudForm");

        const closeModal = () => {
            modalOverlay.classList.remove("active");
            crudForm.reset();
            this.editingProductId = null;
            
            // Limpiar inputs agregados y vista previa
            this.uploadedImages = [];
            this.renderGalleryPreviews();
            
            document.getElementById("prodSalePriceGroup").style.display = "none";
            const salePriceInput = document.getElementById("prodSalePrice");
            salePriceInput.value = "";
            salePriceInput.disabled = true;
            salePriceInput.required = false;

            // Limpiar contenedor de variantes
            const variantsContainer = document.getElementById("variantsContainer");
            if (variantsContainer) {
                variantsContainer.innerHTML = "";
            }
        };

        // Escuchar botón de añadir variante
        const addVariantBtn = document.getElementById("addVariantRowBtn");
        const variantsContainer = document.getElementById("variantsContainer");
        if (addVariantBtn && variantsContainer) {
            addVariantBtn.addEventListener("click", () => {
                this.createVariantRow(variantsContainer, "", "", 0, "");
            });
        }

        // Escuchar subida de archivo para la foto (Galería múltiple de hasta 6 fotos)
        const fileInput = document.getElementById("prodGalleryFileInput");

        if (fileInput) {
            fileInput.addEventListener("change", async (e) => {
                const files = Array.from(e.target.files);
                if (files.length === 0) return;

                if (!this.uploadedImages) {
                    this.uploadedImages = [];
                }

                const remainingSlots = 6 - this.uploadedImages.length;
                if (remainingSlots <= 0) {
                    window.components.showToast("Ya has cargado el límite de 6 fotos", "error");
                    fileInput.value = "";
                    return;
                }

                // Limitar la selección a los espacios disponibles
                const filesToProcess = files.slice(0, remainingSlots);
                if (files.length > remainingSlots) {
                    window.components.showToast(`Solo se procesarán las primeras ${remainingSlots} imágenes (límite de 6)`, "warning");
                }

                for (const file of filesToProcess) {
                    if (file.size > 2 * 1024 * 1024) { // Límite de 2MB por imagen
                        window.components.showToast(`La imagen "${file.name}" supera los 2MB y no se cargará`, "error");
                        continue;
                    }

                    try {
                        const base64 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (evt) => resolve(evt.target.result);
                            reader.onerror = () => reject(new Error("Error al leer el archivo"));
                            reader.readAsDataURL(file);
                        });
                        this.uploadedImages.push(base64);
                    } catch (err) {
                        window.components.showToast(`Error al cargar la imagen "${file.name}"`, "error");
                    }
                }

                fileInput.value = ""; // Resetear input
                this.renderGalleryPreviews();
            });
        }

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

    renderGalleryPreviews: function() {
        const previewContainer = document.getElementById("prodGalleryPreviews");
        if (!previewContainer) return;

        previewContainer.innerHTML = "";
        
        if (!this.uploadedImages) {
            this.uploadedImages = [];
        }
        
        this.uploadedImages.forEach((base64, index) => {
            const isCover = index === 0;
            const card = document.createElement("div");
            card.className = "gallery-preview-card";
            card.style.cssText = "position: relative; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border); overflow: hidden; padding-top: 100%; height: 0; background-color: var(--color-bg-alt);";
            
            const img = document.createElement("img");
            img.src = base64;
            img.alt = `Foto ${index + 1}`;
            img.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;";
            card.appendChild(img);

            // Cover badge / button
            if (isCover) {
                const badge = document.createElement("span");
                badge.textContent = "Portada";
                badge.style.cssText = "position: absolute; bottom: 4px; left: 4px; background-color: var(--color-primary); color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; z-index: 5;";
                card.appendChild(badge);
            } else {
                const coverBtn = document.createElement("button");
                coverBtn.type = "button";
                coverBtn.textContent = "Portada";
                coverBtn.title = "Hacer portada";
                coverBtn.style.cssText = "position: absolute; bottom: 4px; left: 4px; background-color: rgba(0,0,0,0.6); color: white; font-size: 0.65rem; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; transition: background 0.2s; z-index: 5;";
                coverBtn.addEventListener("mouseover", () => coverBtn.style.backgroundColor = "var(--color-primary)");
                coverBtn.addEventListener("mouseout", () => coverBtn.style.backgroundColor = "rgba(0,0,0,0.6)");
                coverBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const targetImg = this.uploadedImages.splice(index, 1)[0];
                    this.uploadedImages.unshift(targetImg);
                    this.renderGalleryPreviews();
                });
                card.appendChild(coverBtn);
            }

            // Remove button
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.innerHTML = "&times;";
            removeBtn.style.cssText = "position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background-color: rgba(220, 53, 69, 0.8); color: white; border: none; font-size: 14px; font-weight: bold; line-height: 18px; text-align: center; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; z-index: 5;";
            removeBtn.addEventListener("mouseover", () => removeBtn.style.backgroundColor = "rgba(220, 53, 69, 1)");
            removeBtn.addEventListener("mouseout", () => removeBtn.style.backgroundColor = "rgba(220, 53, 69, 0.8)");
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.uploadedImages.splice(index, 1);
                this.renderGalleryPreviews();
            });
            card.appendChild(removeBtn);

            previewContainer.appendChild(card);
        });

        // Habilitar/Deshabilitar área de carga según el límite
        const fileInput = document.getElementById("prodGalleryFileInput");
        const uploadBox = fileInput ? fileInput.parentElement : null;
        const uploadText = document.getElementById("prodGalleryUploadText");
        if (uploadBox) {
            if (this.uploadedImages.length >= 6) {
                uploadBox.style.pointerEvents = "none";
                uploadBox.style.opacity = "0.4";
                if (uploadText) uploadText.textContent = "Límite de 6 fotos alcanzado";
            } else {
                uploadBox.style.pointerEvents = "auto";
                uploadBox.style.opacity = "1";
                if (uploadText) uploadText.textContent = "Hacé clic o arrastrá para subir fotos";
            }
        }
    },

    switchTab: function(tabName) {
        this.activeTab = tabName;
        const tabContentEl = document.getElementById("adminTabContent");
        if (!tabContentEl) return;

        // Sincronizar botones de navegación lateral
        const navButtons = document.querySelectorAll(".admin-nav-btn");
        navButtons.forEach(btn => {
            if (btn.getAttribute("data-tab") === tabName) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        if (tabName === "dashboard") {
            this.renderTabDashboard(tabContentEl);
        } else if (tabName === "products") {
            this.renderTabProducts(tabContentEl);
        } else if (tabName === "orders") {
            this.renderTabOrders(tabContentEl);
        } else if (tabName === "users") {
            this.renderTabUsers(tabContentEl);
        } else if (tabName === "messages") {
            this.renderTabMessages(tabContentEl);
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
                    <td class="hide-mobile"><span class="status-badge" style="background-color: var(--color-primary-light); color: var(--color-primary);">${p.category}</span></td>
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
                                <th class="hide-mobile">Categoría</th>
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
            
            // Limpiar galería de fotos
            this.uploadedImages = [];
            this.renderGalleryPreviews();
            
            document.getElementById("prodOnSale").checked = false;
            document.getElementById("prodSalePriceGroup").style.display = "none";
            document.getElementById("prodSalePrice").value = "";
            document.getElementById("prodSalePrice").disabled = true;
            document.getElementById("prodSalePrice").required = false;

            // Inicializar variantes con una fila vacía
            const variantsContainer = document.getElementById("variantsContainer");
            if (variantsContainer) {
                variantsContainer.innerHTML = "";
                this.createVariantRow(variantsContainer, "", "", 0, "");
            }

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
                    document.getElementById("prodSizes").value = prod.sizes ? prod.sizes.join(", ") : "";

                    // Cargar variantes de color + talle
                    const variantsContainer = document.getElementById("variantsContainer");
                    if (variantsContainer) {
                        variantsContainer.innerHTML = "";
                        if (prod.variants && prod.variants.length > 0) {
                            prod.variants.forEach(v => {
                                this.createVariantRow(variantsContainer, v.color, v.size || "", v.stock, v.image);
                            });
                        } else if (prod.colors && prod.colors.length > 0) {
                            // Fallback robusto mapeando combinaciones
                            const fallbackSizes = (prod.sizes && prod.sizes.length > 0) ? prod.sizes : ["Único"];
                            const totalCombinations = prod.colors.length * fallbackSizes.length;
                            const computedStock = Math.floor(prod.stock / totalCombinations);
                            let combIndex = 0;
                            
                            prod.colors.forEach(col => {
                                fallbackSizes.forEach(sz => {
                                    const stockForThisComb = (combIndex === totalCombinations - 1)
                                        ? prod.stock - (computedStock * (totalCombinations - 1))
                                        : computedStock;
                                    this.createVariantRow(variantsContainer, col, sz, stockForThisComb, prod.image);
                                    combIndex++;
                                });
                            });
                        } else {
                            this.createVariantRow(variantsContainer, "Único", "Único", prod.stock, prod.image);
                        }
                    }

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

                    // Cargar galería de fotos
                    this.uploadedImages = prod.images && prod.images.length > 0 ? [...prod.images] : (prod.image ? [prod.image] : []);
                    this.renderGalleryPreviews();

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
        const sizeVal = document.getElementById("prodSizes").value;
        const onSale = document.getElementById("prodOnSale").checked;
        const base64Value = (this.uploadedImages && this.uploadedImages.length > 0) ? this.uploadedImages[0] : "";

        // Recopilar variantes de color + talle
        const variantRows = document.querySelectorAll(".variant-row");
        const variants = [];
        const colors = [];
        const sizes = [];
        let computedTotalStock = 0;

        variantRows.forEach(row => {
            const colorInput = row.querySelector(".variant-color-input");
            const sizeInput = row.querySelector(".variant-size-input");
            const stockInput = row.querySelector(".variant-stock-input");
            const base64Input = row.querySelector(".variant-base64-input");

            const color = colorInput ? colorInput.value.trim() : "";
            const size = sizeInput ? sizeInput.value.trim() : "";
            const stock = stockInput ? parseInt(stockInput.value) || 0 : 0;
            const image = base64Input ? base64Input.value : "";

            if (color && size) {
                variants.push({ color, size, stock, image });
                if (!colors.includes(color)) {
                    colors.push(color);
                }
                if (!sizes.includes(size)) {
                    sizes.push(size);
                }
                computedTotalStock += stock;
            }
        });

        // Validar que haya al menos una variante de color válida
        if (variants.length === 0) {
            window.components.showToast("Debes ingresar al menos una variante válida (con color y talle)", "error");
            return;
        }

        // Si no tiene imagen principal, intentar usar la de la primera variante
        let mainImage = base64Value || "";
        if (!mainImage && variants.length > 0 && variants[0].image) {
            mainImage = variants[0].image;
        }

        // Construir la galería completa de imágenes
        const uniqueImages = this.uploadedImages && this.uploadedImages.length > 0 ? [...this.uploadedImages] : [];
        if (mainImage && !uniqueImages.includes(mainImage)) {
            uniqueImages.unshift(mainImage);
        }
        variants.forEach(v => {
            if (v.image && !uniqueImages.includes(v.image)) {
                uniqueImages.push(v.image);
            }
        });

        window.components.showToast(`Guardando... Variantes: ${variants.length} | Stock total: ${computedTotalStock}`, "info");

        const productData = {
            title: document.getElementById("prodTitle").value,
            category: document.getElementById("prodCategory").value,
            price: parseFloat(document.getElementById("prodPrice").value),
            onSale: onSale,
            salePrice: onSale ? parseFloat(document.getElementById("prodSalePrice").value) : 0,
            stock: computedTotalStock,
            featured: document.getElementById("prodFeatured").value === "true",
            description: document.getElementById("prodDesc").value,
            materials: document.getElementById("prodMaterials").value,
            colors: colors,
            sizes: sizes,
            variants: variants,
            image: mainImage,
            images: uniqueImages
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
                    <td class="hide-mobile">${orderDate} hs.</td>
                    <td class="hide-mobile">
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
                                <th class="hide-mobile">Fecha</th>
                                <th class="hide-mobile">Pago</th>
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
                <div class="admin-modal" style="max-width: 500px; width: 100%;">
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
                    <td class="hide-mobile">${regDate}</td>
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
                                <th class="hide-mobile">Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    createVariantRow: function(container, color = "", size = "", stock = 0, image = "") {
        const row = document.createElement("div");
        row.className = "variant-row";
        
        const previewStyle = image ? "display: block;" : "display: none;";
        const placeholderStyle = image ? "display: none;" : "display: flex; align-items: center; justify-content: center;";
        const srcAttr = image ? `src="${image}"` : "";

        row.innerHTML = `
            <div>
                <input type="text" class="form-control variant-color-input" placeholder="Color" value="${color}" required style="padding: 0.4rem 0.5rem; font-size: 0.8rem;">
            </div>
            <div>
                <input type="text" class="form-control variant-size-input" placeholder="Talle" value="${size}" required style="padding: 0.4rem 0.5rem; font-size: 0.8rem;">
            </div>
            <div>
                <input type="number" class="form-control variant-stock-input" placeholder="Stock" min="0" value="${stock}" required style="padding: 0.4rem 0.5rem; font-size: 0.8rem;">
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; flex-grow: 1;">
                <div class="variant-img-preview-wrapper" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--color-border); overflow: hidden; background: var(--color-bg); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                    <img class="variant-img-preview" ${srcAttr} style="width: 100%; height: 100%; object-fit: cover; ${previewStyle}">
                    <span class="variant-img-placeholder" style="font-size: 0.55rem; color: var(--color-text-muted); font-weight: 500; ${placeholderStyle}">No</span>
                </div>
                <input type="file" class="variant-file-input" accept="image/*" style="font-size: 0.7rem; cursor: pointer; flex-grow: 1;">
                <input type="hidden" class="variant-base64-input" value="${image}">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-variant-btn" style="padding: 0.3rem; border-radius: var(--border-radius-sm); display: inline-flex; align-items: center; justify-content: center;" title="Eliminar Variante">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
        `;

        container.appendChild(row);
        this.bindVariantRowEvents(row);
        if (window.lucide) window.lucide.createIcons();
    },

    bindVariantRowEvents: function(row) {
        const fileInput = row.querySelector(".variant-file-input");
        const base64Input = row.querySelector(".variant-base64-input");
        const imgPreview = row.querySelector(".variant-img-preview");
        const placeholder = row.querySelector(".variant-img-placeholder");
        const sizeInput = row.querySelector(".variant-size-input");
        const stockInput = row.querySelector(".variant-stock-input");
        const removeBtn = row.querySelector(".remove-variant-btn");

        stockInput.addEventListener("input", () => {
            this.recalculateTotalStockAndSizes();
        });

        if (sizeInput) {
            sizeInput.addEventListener("input", () => {
                this.recalculateTotalStockAndSizes();
            });
        }

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                window.components.showToast(`Procesando foto de variante: ${file.name} (${Math.round(file.size / 1024)} KB)`, "info");
                if (file.size > 2 * 1024 * 1024) {
                    window.components.showToast("La foto de la variante debe ser menor a 2MB", "error");
                    fileInput.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onerror = () => {
                    window.components.showToast("Error al leer el archivo de imagen de variante", "error");
                };
                reader.onload = (evt) => {
                    const base64 = evt.target.result;
                    base64Input.value = base64;
                    imgPreview.src = base64;
                    imgPreview.style.display = "block";
                    placeholder.style.display = "none";
                    window.components.showToast("¡Foto de variante cargada con éxito!", "success");
                    
                    if (!this.uploadedImages) {
                        this.uploadedImages = [];
                    }
                    if (this.uploadedImages.length === 0) {
                        this.uploadedImages.push(base64);
                        this.renderGalleryPreviews();
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        removeBtn.addEventListener("click", () => {
            row.remove();
            this.recalculateTotalStockAndSizes();
            window.components.showToast("Variante eliminada", "info");
        });
    },

    recalculateTotalStockAndSizes: function() {
        const stockInputs = document.querySelectorAll(".variant-stock-input");
        const sizeInputs = document.querySelectorAll(".variant-size-input");
        
        let total = 0;
        stockInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });

        const uniqueSizes = [];
        sizeInputs.forEach(input => {
            const val = input.value.trim();
            if (val && !uniqueSizes.includes(val)) {
                uniqueSizes.push(val);
            }
        });

        const prodStockInput = document.getElementById("prodStock");
        if (prodStockInput) {
            prodStockInput.value = total;
        }

        const prodSizesInput = document.getElementById("prodSizes");
        if (prodSizesInput) {
            prodSizesInput.value = uniqueSizes.join(", ");
        }
    },

    updateUnreadMessagesBadge: function() {
        const badge = document.getElementById("unreadMessagesBadge");
        if (badge) {
            const count = window.state.getUnreadMessagesCount();
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        }
    },

    renderTabMessages: function(element) {
        const messages = window.state.getMessages();
        const settings = window.state.getContactSettings() || { email: "arielmartinelli2019@gmail.com", whatsapp: "5493516121498" };

        const configHtml = `
            <div class="admin-table-container" style="margin-bottom: 2rem; padding: 1.5rem; background-color: var(--color-card); border-radius: var(--border-radius-lg); border: 1px solid var(--color-border);">
                <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 1rem; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="settings" style="width: 20px; height: 20px;"></i> Configuración de Canales de Contacto
                </h3>
                <form id="contactSettingsForm" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: flex-end;">
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label" for="settingsEmail" style="font-size: 0.85rem; font-weight: 600;">Email de Destino</label>
                        <input type="email" id="settingsEmail" class="form-control" value="${settings.email}" required style="padding: 0.5rem 0.75rem;">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label" for="settingsWhatsapp" style="font-size: 0.85rem; font-weight: 600;">Teléfono WhatsApp (Sin +, con código de país)</label>
                        <input type="text" id="settingsWhatsapp" class="form-control" value="${settings.whatsapp}" required placeholder="5491122334455" style="padding: 0.5rem 0.75rem;">
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm" style="padding: 0.6rem 1.2rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="save" style="width: 16px; height: 16px;"></i> Guardar
                    </button>
                </form>
            </div>
        `;

        let tableRowsHtml = "";
        
        // Helper para normalizar el asunto
        const mapSubject = (sub) => {
            if (sub === "egresados") return "Presupuesto Ropa de Egresados";
            if (sub === "mochilas") return "Consulta sobre Mochilas / Stock";
            if (sub === "pedido") return "Consulta sobre un Pedido Realizado";
            if (sub === "taller") return "Alianzas comerciales / Taller";
            return sub; // Si ya viene en formato amigable
        };

        if (messages.length === 0) {
            tableRowsHtml = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 3rem;">El buzón de entrada está vacío.</td></tr>`;
        } else {
            const sortedMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
            sortedMessages.forEach(m => {
                const msgDate = new Date(m.date).toLocaleDateString('es-AR', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                const subjectLabel = mapSubject(m.subject);
                
                tableRowsHtml += `
                    <tr style="${m.read ? '' : 'font-weight: 700; background-color: rgba(230, 126, 34, 0.05);'}">
                        <td>
                            ${m.read ? '<span style="color:var(--color-text-muted); font-size: 0.85rem;">Leído</span>' : '<span style="color:var(--color-primary); font-size: 0.85rem; font-weight: 700;">🆕 Nuevo</span>'}
                        </td>
                        <td>
                            <strong>${m.name}</strong>
                            <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 400;">
                                ${m.email}
                                ${m.phone ? `<br><span style="color: var(--color-primary); font-weight: 500; display: inline-flex; align-items: center; gap: 0.2rem; margin-top: 0.15rem;">📞 ${m.phone}</span>` : ''}
                            </div>
                        </td>
                        <td>
                            <div style="font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-muted); cursor: pointer;" title="Haga clic para ver el mensaje completo" class="msg-text-preview" data-id="${m.id}">
                                ${m.message}
                            </div>
                        </td>
                        <td class="hide-mobile"><span class="status-badge" style="background-color: var(--color-bg-alt); color: var(--color-text-primary); font-size: 0.75rem;">${subjectLabel}</span></td>
                        <td class="hide-mobile" style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 400;">${msgDate} hs.</td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-outline btn-sm view-msg-btn" data-id="${m.id}" style="padding: 0.4rem 0.6rem;" title="Leer Mensaje">
                                    <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-msg-btn" data-id="${m.id}" style="padding: 0.4rem 0.6rem;" title="Eliminar">
                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        const inboxHtml = `
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Buzón de Entrada</h3>
                </div>
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th style="width: 90px;">Estado</th>
                                <th>Remitente</th>
                                <th>Mensaje</th>
                                <th class="hide-mobile">Asunto</th>
                                <th class="hide-mobile">Fecha</th>
                                <th style="width: 100px;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- MODAL LECTURA DE MENSAJE (OCULTO) -->
            <div class="admin-modal-overlay" id="messageModalOverlay" style="z-index: 1000;">
                <div class="admin-modal" style="max-width: 500px; width: 100%;">
                    <div class="admin-modal-header">
                        <h3>Detalle del Mensaje</h3>
                        <button class="icon-btn" id="closeMessageModalBtn">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="admin-modal-body" id="messageModalBody">
                        <!-- Carga dinámica -->
                    </div>
                    <div class="admin-modal-footer">
                        <button class="btn btn-primary btn-sm" id="confirmMessageModalBtn">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        element.innerHTML = configHtml + inboxHtml;
        this.initMessagesTabEvents();
    },

    initMessagesTabEvents: function() {
        const settingsForm = document.getElementById("contactSettingsForm");
        if (settingsForm) {
            settingsForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("settingsEmail").value;
                const whatsapp = document.getElementById("settingsWhatsapp").value;

                window.state.updateContactSettings(email, whatsapp);
                window.components.showToast("Configuración de contacto guardada", "success");
            });
        }

        const viewButtons = document.querySelectorAll(".view-msg-btn");
        const deleteButtons = document.querySelectorAll(".delete-msg-btn");
        const textPreviews = document.querySelectorAll(".msg-text-preview");
        
        const modalOverlay = document.getElementById("messageModalOverlay");
        const modalBody = document.getElementById("messageModalBody");
        const closeBtn = document.getElementById("closeMessageModalBtn");
        const confirmBtn = document.getElementById("confirmMessageModalBtn");

        // Helper para normalizar el asunto
        const mapSubject = (sub) => {
            if (sub === "egresados") return "Presupuesto Ropa de Egresados";
            if (sub === "mochilas") return "Consulta sobre Mochilas / Stock";
            if (sub === "pedido") return "Consulta sobre un Pedido Realizado";
            if (sub === "taller") return "Alianzas comerciales / Taller";
            return sub;
        };

        const openMessageModal = (id) => {
            const messages = window.state.getMessages();
            const msg = messages.find(m => m.id === id);

            if (msg) {
                window.state.markMessageAsRead(id);
                this.updateUnreadMessagesBadge();

                const msgDate = new Date(msg.date).toLocaleString('es-AR');
                const subjectLabel = mapSubject(msg.subject);
                
                modalBody.innerHTML = `
                    <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem;">
                        <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>De:</strong> ${msg.name} (&lt;${msg.email}&gt;)</p>
                        ${msg.phone ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Teléfono:</strong> ${msg.phone}</p>` : ''}
                        <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Fecha:</strong> ${msgDate} hs.</p>
                        <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Asunto:</strong> ${subjectLabel}</p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 0.5rem; font-size: 1rem; color: var(--color-primary);">Consulta:</h4>
                        <div style="background: var(--color-bg-alt); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border); white-space: pre-wrap; font-size: 0.95rem; line-height: 1.5; text-align: left;">${msg.message}</div>
                    </div>
                `;

                modalOverlay.classList.add("active");
            }
        };

        viewButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                openMessageModal(id);
            });
        });

        textPreviews.forEach(el => {
            el.addEventListener("click", () => {
                const id = el.getAttribute("data-id");
                openMessageModal(id);
            });
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm("¿Estás seguro de que deseas eliminar este mensaje?")) {
                    window.state.deleteMessage(id);
                    window.components.showToast("Mensaje eliminado", "success");
                    this.switchTab("messages");
                }
            });
        });

        const hideModal = () => {
            modalOverlay.classList.remove("active");
            this.switchTab("messages");
        };

        if (closeBtn) closeBtn.addEventListener("click", hideModal);
        if (confirmBtn) confirmBtn.addEventListener("click", hideModal);
        if (window.lucide) window.lucide.createIcons();
    }
};
