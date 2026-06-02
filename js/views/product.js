/**
 * SUMMER QUEEN - VISTA DETALLE DE PRODUCTO (PRODUCT)
 */

window.views.product = {
    render: function(container, param, query) {
        if (!param) {
            this.renderError(container);
            return;
        }

        const product = window.state.getProductById(param);
        if (!product) {
            this.renderError(container);
            return;
        }

        // Estado local del producto seleccionado
        this.selectedConfig = {
            productId: product.id,
            color: product.colors && product.colors.length > 0 ? product.colors[0] : "",
            size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : "",
            quantity: 1
        };

        // Formatear precio
        const formattedPrice = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(product.price);

        // Estilos para galería
        const mainImage = product.image;
        const allImages = product.images || [mainImage];

        // Construir HTML de la galería de miniaturas
        let thumbnailsHtml = "";
        if (allImages.length > 1) {
            allImages.forEach((img, idx) => {
                thumbnailsHtml += `
                    <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-index="${idx}" data-src="${img}">
                        <img src="${img}" alt="${product.title} vista ${idx + 1}">
                    </div>
                `;
            });
        }

        // Botones de variante: Talles
        let sizesHtml = "";
        if (product.sizes && product.sizes.length > 0) {
            sizesHtml = `
                <div class="product-config-option">
                    <span class="option-title">Seleccionar Talle / Medida</span>
                    <div class="variant-buttons">
            `;
            product.sizes.forEach((sz, idx) => {
                sizesHtml += `<button class="variant-btn size-btn ${idx === 0 ? 'active' : ''}" data-value="${sz}">${sz}</button>`;
            });
            sizesHtml += `</div></div>`;
        }

        // Botones de variante: Colores
        let colorsHtml = "";
        if (product.colors && product.colors.length > 0) {
            colorsHtml = `
                <div class="product-config-option">
                    <span class="option-title">Seleccionar Color</span>
                    <div class="variant-buttons">
            `;
            product.colors.forEach((col, idx) => {
                colorsHtml += `<button class="variant-btn color-btn ${idx === 0 ? 'active' : ''}" data-value="${col}">${col}</button>`;
            });
            colorsHtml += `</div></div>`;
        }

        // Renderizado del contenido principal
        container.innerHTML = `
            <div class="container product-details">
                <!-- Enlace de regreso -->
                <a href="#/catalog" class="btn btn-outline btn-sm" style="margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Volver al Catálogo
                </a>

                <div class="product-detail-layout">
                    <!-- COL 1: IMÁGENES -->
                    <div class="product-gallery">
                        <div class="main-image-container">
                            <img src="${mainImage}" id="productMainImage" alt="${product.title}">
                        </div>
                        <div class="thumbnail-list">
                            ${thumbnailsHtml}
                        </div>
                    </div>

                    <!-- COL 2: INFORMACIÓN Y ACCIONES -->
                    <div class="product-info-panel">
                        <span style="color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1.5px; margin-bottom: 0.5rem;">
                            Categoría: ${product.category}
                        </span>
                        <h1 class="product-title">${product.title}</h1>
                        <div class="product-price">${formattedPrice}</div>
                        
                        <p class="product-description">${product.description}</p>
                        
                        <!-- Configuración de variantes -->
                        ${sizesHtml}
                        ${colorsHtml}

                        <!-- Cantidad y Compra -->
                        <div class="product-config-option" style="margin-top: 1rem;">
                            <span class="option-title">Cantidad</span>
                            <div class="purchase-actions">
                                <div class="qty-selector">
                                    <button class="qty-btn" id="prodQtyMinus">
                                        <i data-lucide="minus" style="width: 14px; height: 14px;"></i>
                                    </button>
                                    <input type="number" id="prodQtyVal" value="1" min="1" max="${product.stock}" readonly>
                                    <button class="qty-btn" id="prodQtyPlus">
                                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                                    </button>
                                </div>
                                
                                <button class="btn btn-primary" id="addToCartMainBtn" style="flex-grow: 1;" ${product.stock === 0 ? 'disabled' : ''}>
                                    <i data-lucide="shopping-bag"></i> 
                                    ${product.stock === 0 ? 'Sin Stock Disponible' : 'Agregar al Carrito'}
                                </button>
                            </div>
                            <span style="font-size: 0.85rem; color: var(--color-text-muted);">
                                ${product.stock > 0 ? `Stock disponible: <strong>${product.stock}</strong> unidades` : '<strong style="color: var(--color-danger);">Producto Agotado</strong>'}
                            </span>
                        </div>

                        <!-- Especificaciones de Confección -->
                        <div class="product-specs">
                            <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 1rem;">Ficha Técnica de Confección</h3>
                            <table>
                                <tr>
                                    <td>Materiales</td>
                                    <td>${product.materials || "Algodón & Poliéster de alta calidad"}</td>
                                </tr>
                                <tr>
                                    <td>Tipo de Costura</td>
                                    <td>Overlock de 5 hilos + refuerzo de seguridad</td>
                                </tr>
                                <tr>
                                    <td>Cuidado de Prenda</td>
                                    <td>Lavar con agua fría, no planchar estampas directas</td>
                                </tr>
                                <tr>
                                    <td>Disponibilidad</td>
                                    <td>En stock (taller propio)</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Atar manejadores de eventos
        this.initProductEvents(product);
    },

    initProductEvents: function(product) {
        const mainImageEl = document.getElementById("productMainImage");
        const thumbnails = document.querySelectorAll(".thumbnail-item");
        const sizeButtons = document.querySelectorAll(".size-btn");
        const colorButtons = document.querySelectorAll(".color-btn");
        
        const qtyVal = document.getElementById("prodQtyVal");
        const qtyMinus = document.getElementById("prodQtyMinus");
        const qtyPlus = document.getElementById("prodQtyPlus");
        const addBtn = document.getElementById("addToCartMainBtn");

        // Eventos de miniaturas
        thumbnails.forEach(thumb => {
            thumb.addEventListener("click", () => {
                thumbnails.forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
                mainImageEl.src = thumb.getAttribute("data-src");
            });
        });

        // Eventos Talles
        sizeButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                sizeButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.selectedConfig.size = btn.getAttribute("data-value");
            });
        });

        // Eventos Colores
        colorButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                colorButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.selectedConfig.color = btn.getAttribute("data-value");
            });
        });

        // Eventos Cantidad
        qtyMinus.addEventListener("click", () => {
            let current = parseInt(qtyVal.value);
            if (current > 1) {
                qtyVal.value = current - 1;
                this.selectedConfig.quantity = current - 1;
            }
        });

        qtyPlus.addEventListener("click", () => {
            let current = parseInt(qtyVal.value);
            if (current < product.stock) {
                qtyVal.value = current + 1;
                this.selectedConfig.quantity = current + 1;
            } else {
                window.components.showToast("Límite de stock disponible", "info");
            }
        });

        // Evento Agregar al Carrito
        addBtn.addEventListener("click", () => {
            const { productId, quantity, color, size } = this.selectedConfig;
            
            const success = window.state.addToCart(productId, quantity, color, size);
            if (success) {
                window.components.showToast(`¡${product.title} agregado al carrito!`, "success");
                // Abrir el carrito lateral
                document.getElementById("cartDrawer").classList.add("active");
                document.getElementById("cartOverlay").classList.add("active");
                window.components.renderCartDrawer();
            }
        });
    },

    renderError: function(container) {
        container.innerHTML = `
            <div class="container" style="padding: 5rem 2rem; text-align: center;">
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 1rem;">Producto no encontrado</h2>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">El artículo que buscas no existe o fue dado de baja.</p>
                <a href="#/catalog" class="btn btn-primary">Volver al Catálogo</a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }
};
