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

        const initialColor = product.colors && product.colors.length > 0 ? product.colors[0] : "";
        const initialSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "";
        const initialVariant = (product.variants && product.variants.length > 0)
            ? product.variants.find(v => 
                v.color.toLowerCase() === initialColor.toLowerCase() && 
                (v.size || "").toLowerCase() === initialSize.toLowerCase()
              )
            : null;
        const initialStock = initialVariant ? initialVariant.stock : product.stock;

        // Estado local del producto seleccionado
        this.selectedConfig = {
            productId: product.id,
            color: initialColor,
            size: initialSize,
            quantity: initialStock > 0 ? 1 : 0
        };

        // Formatear precio
        const formatter = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        });

        let priceHtml = "";
        if (product.onSale && product.salePrice > 0) {
            const discountPct = Math.round((1 - (product.salePrice / product.price)) * 100);
            priceHtml = `
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                    <span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 1.3rem; font-weight: 500;">
                        ${formatter.format(product.price)}
                    </span>
                    <span style="font-size: 2.2rem; font-weight: 700; color: var(--color-danger);">
                        ${formatter.format(product.salePrice)}
                    </span>
                    <span class="status-badge" style="background-color: var(--color-danger-bg); color: var(--color-danger); font-size: 0.85rem; font-weight: 700; padding: 0.4rem 0.8rem; border-radius: var(--border-radius-sm);">
                        ¡${discountPct}% OFF!
                    </span>
                </div>
            `;
        } else {
            priceHtml = `
                <div class="product-price">${formatter.format(product.price)}</div>
            `;
        }

        // Estilos para galería
        const mainImage = (initialVariant && initialVariant.image) ? initialVariant.image : product.image;
        
        // Reunir todas las imágenes únicas de variantes para la galería de miniaturas
        let allImages = [];
        if (product.variants && product.variants.length > 0) {
            allImages = [...new Set(product.variants.map(v => v.image).filter(Boolean))];
        }
        if (allImages.length === 0) {
            allImages = product.images || [mainImage];
        }

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
                        ${priceHtml}
                        
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
                                    <input type="number" id="prodQtyVal" value="${initialStock > 0 ? '1' : '0'}" min="${initialStock > 0 ? '1' : '0'}" max="${initialStock}" readonly>
                                    <button class="qty-btn" id="prodQtyPlus">
                                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                                    </button>
                                </div>
                                
                                <button class="btn btn-primary" id="addToCartMainBtn" style="flex-grow: 1;" ${initialStock === 0 ? 'disabled' : ''}>
                                    <i data-lucide="shopping-bag"></i> 
                                    ${initialStock === 0 ? 'Sin Stock en este color' : 'Agregar al Carrito'}
                                </button>
                            </div>
                             <span style="font-size: 0.85rem; color: var(--color-text-muted);" id="variantStockLabel">
                                ${initialStock > 0 ? `Stock disponible: <strong>${initialStock}</strong> unidades` : '<strong style="color: var(--color-danger);">Agotado en este color</strong>'}
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
                this.updateSelectedVariant(product);
            });
        });

        // Eventos Colores
        colorButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                colorButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.selectedConfig.color = btn.getAttribute("data-value");
                this.updateSelectedVariant(product);
            });
        });

        // Eventos Cantidad
        qtyMinus.addEventListener("click", () => {
            let current = parseInt(qtyVal.value);
            const minAllowed = this.selectedConfig.quantity > 0 ? 1 : 0;
            if (current > minAllowed) {
                qtyVal.value = current - 1;
                this.selectedConfig.quantity = current - 1;
            }
        });

        qtyPlus.addEventListener("click", () => {
            let current = parseInt(qtyVal.value);
            
            // Buscar stock límite de la variante de color y talle activa
            const activeColor = this.selectedConfig.color;
            const activeSize = this.selectedConfig.size;
            const variant = (product.variants && product.variants.length > 0)
                ? product.variants.find(v => 
                    v.color.toLowerCase() === activeColor.toLowerCase() && 
                    (v.size || "").toLowerCase() === activeSize.toLowerCase()
                  )
                : null;
            const maxStock = variant ? variant.stock : product.stock;

            if (current < maxStock) {
                qtyVal.value = current + 1;
                this.selectedConfig.quantity = current + 1;
            } else {
                window.components.showToast("Límite de stock disponible para esta combinación", "info");
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

    updateSelectedVariant: function(product) {
        const mainImageEl = document.getElementById("productMainImage");
        const thumbnails = document.querySelectorAll(".thumbnail-item");
        const qtyVal = document.getElementById("prodQtyVal");
        const addBtn = document.getElementById("addToCartMainBtn");
        const stockLabelEl = document.getElementById("variantStockLabel");

        const selectedColor = this.selectedConfig.color;
        const selectedSize = this.selectedConfig.size;

        if (product.variants && product.variants.length > 0) {
            // Buscar la variante específica para color + talle
            const variant = product.variants.find(v => 
                v.color.toLowerCase() === selectedColor.toLowerCase() && 
                (v.size || "").toLowerCase() === selectedSize.toLowerCase()
            );

            if (variant) {
                // Actualizar imagen principal si la variante tiene
                if (variant.image) {
                    mainImageEl.src = variant.image;
                    thumbnails.forEach(t => {
                        if (t.getAttribute("data-src") === variant.image) {
                            t.classList.add("active");
                        } else {
                            t.classList.remove("active");
                        }
                    });
                } else {
                    // Fallback a cualquier imagen del mismo color que tenga foto
                    const fallbackColorVariant = product.variants.find(v => 
                        v.color.toLowerCase() === selectedColor.toLowerCase() && v.image
                    );
                    if (fallbackColorVariant) {
                        mainImageEl.src = fallbackColorVariant.image;
                        thumbnails.forEach(t => {
                            if (t.getAttribute("data-src") === fallbackColorVariant.image) {
                                t.classList.add("active");
                            } else {
                                t.classList.remove("active");
                            }
                        });
                    }
                }

                // Actualizar stock
                if (stockLabelEl) {
                    if (variant.stock > 0) {
                        stockLabelEl.innerHTML = `Stock disponible: <strong>${variant.stock}</strong> unidades`;
                        addBtn.disabled = false;
                        addBtn.innerHTML = `<i data-lucide="shopping-bag"></i> Agregar al Carrito`;
                    } else {
                        stockLabelEl.innerHTML = `<strong style="color: var(--color-danger);">Agotado en esta combinación</strong>`;
                        addBtn.disabled = true;
                        addBtn.innerHTML = `Sin Stock en esta combinación`;
                    }
                }

                // Ajustar input de cantidad
                qtyVal.value = variant.stock > 0 ? "1" : "0";
                this.selectedConfig.quantity = variant.stock > 0 ? 1 : 0;
            } else {
                // Combinación color + talle no fabricada
                if (stockLabelEl) {
                    stockLabelEl.innerHTML = `<strong style="color: var(--color-danger);">Combinación no disponible</strong>`;
                }
                addBtn.disabled = true;
                addBtn.innerHTML = `No disponible`;
                qtyVal.value = "0";
                this.selectedConfig.quantity = 0;
            }
        } else {
            // Producto común
            if (stockLabelEl) {
                if (product.stock > 0) {
                    stockLabelEl.innerHTML = `Stock disponible: <strong>${product.stock}</strong> unidades`;
                    addBtn.disabled = false;
                    addBtn.innerHTML = `<i data-lucide="shopping-bag"></i> Agregar al Carrito`;
                } else {
                    stockLabelEl.innerHTML = `<strong style="color: var(--color-danger);">Agotado</strong>`;
                    addBtn.disabled = true;
                    addBtn.innerHTML = `Sin Stock`;
                }
            }
            qtyVal.value = product.stock > 0 ? "1" : "0";
            this.selectedConfig.quantity = product.stock > 0 ? 1 : 0;
        }

        if (window.lucide) window.lucide.createIcons();
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
