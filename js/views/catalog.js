/**
 * SUMMER QUEEN - VISTA CATALOGO (CATALOG)
 */

window.views.catalog = {
    render: function(container, param, query) {
        // Estado local de los filtros
        this.activeFilters = {
            search: "",
            categories: query && query.category ? [query.category] : [],
            colors: [],
            maxPrice: 40000,
            sortBy: "featured",
            onlyOnSale: (query && (query.filter === "sale" || query.onlyOnSale === "true")) ? true : false
        };

        // Encontrar precios máximos y mínimos de semillas para el slider
        const allProducts = window.state.getProducts();
        const prices = allProducts.map(p => p.price);
        const absoluteMaxPrice = Math.max(...prices, 40000);
        this.activeFilters.maxPrice = absoluteMaxPrice;

        container.innerHTML = `
            <div class="container">
                <div class="catalog-layout">
                    <!-- SIDEBAR FILTROS -->
                    <aside class="catalog-sidebar">
                        <!-- Categorías -->
                        <div class="filter-section">
                            <h4 class="filter-title">Categorías</h4>
                            <div class="filter-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="cat-filter" value="egresados" ${this.activeFilters.categories.includes("egresados") ? "checked" : ""}>
                                    Ropa para Egresados
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" class="cat-filter" value="mochilas" ${this.activeFilters.categories.includes("mochilas") ? "checked" : ""}>
                                    Mochilas de Diseño
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" class="cat-filter" value="accesorios" ${this.activeFilters.categories.includes("accesorios") ? "checked" : ""}>
                                    Accesorios
                                </label>
                            </div>
                        </div>

                        <!-- Promociones -->
                        <div class="filter-section">
                            <h4 class="filter-title">Promociones</h4>
                            <div class="filter-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="saleFilter" ${this.activeFilters.onlyOnSale ? "checked" : ""}>
                                    Solo Ofertas
                                </label>
                            </div>
                        </div>

                        <!-- Filtro por Precio -->
                        <div class="filter-section">
                            <h4 class="filter-title">Precio Máximo</h4>
                            <div class="price-range-slider">
                                <input type="range" id="priceRange" class="form-control" style="width: 100%; padding:0;" min="3000" max="${absoluteMaxPrice}" step="500" value="${this.activeFilters.maxPrice}">
                                <div class="price-values">
                                    <span>$3.000</span>
                                    <span id="priceVal" style="font-weight: 600; color: var(--color-primary);">$${new Intl.NumberFormat('es-AR').format(this.activeFilters.maxPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Colores -->
                        <div class="filter-section">
                            <h4 class="filter-title">Colores</h4>
                            <div class="color-swatch-list" id="colorFilterList">
                                <span class="color-swatch col-filter" data-color="Negro" style="background-color: #1a1a1a;" title="Negro"></span>
                                <span class="color-swatch col-filter" data-color="Azul" style="background-color: #1e3a8a;" title="Azul"></span>
                                <span class="color-swatch col-filter" data-color="Rojo" style="background-color: #ef4444;" title="Rojo / Borgoña"></span>
                                <span class="color-swatch col-filter" data-color="Gris" style="background-color: #8a8a8a;" title="Gris"></span>
                                <span class="color-swatch col-filter" data-color="Blanco" style="background-color: #f3f4f6; border: 1px solid var(--color-border);" title="Blanco"></span>
                                <span class="color-swatch col-filter" data-color="Verde" style="background-color: #2d5a27;" title="Verde"></span>
                                <span class="color-swatch col-filter" data-color="Mostaza" style="background-color: #ca8a04;" title="Mostaza / Ocre"></span>
                                <span class="color-swatch col-filter" data-color="Kaki" style="background-color: #d2b48c;" title="Kaki / Arena"></span>
                            </div>
                        </div>

                        <!-- Botón Limpiar -->
                        <button id="clearFiltersBtn" class="btn btn-outline btn-block btn-sm" style="margin-top: 1rem;">Limpiar Filtros</button>
                    </aside>

                    <!-- CATALOG MAIN -->
                    <main class="catalog-main">
                        <!-- Toolbar superior -->
                        <div class="catalog-toolbar">
                            <div class="search-bar">
                                <i data-lucide="search"></i>
                                <input type="text" id="searchInput" placeholder="Buscar buzos, mochilas, gorras...">
                            </div>
                            
                            <div class="catalog-sorting">
                                <span style="font-size: 0.9rem; color: var(--color-text-muted); white-space: nowrap;">Ordenar por:</span>
                                <select id="sortSelect" class="form-control" style="padding: 0.5rem 1rem; border-radius: var(--border-radius-sm); font-size: 0.9rem;">
                                    <option value="featured">Destacados</option>
                                    <option value="price-asc">Menor precio</option>
                                    <option value="price-desc">Mayor precio</option>
                                    <option value="name-asc">Nombre A-Z</option>
                                </select>
                            </div>
                        </div>

                        <!-- Grid de Productos -->
                        <div class="catalog-grid" id="catalogGrid">
                            <!-- Productos filtrados -->
                        </div>
                    </main>
                </div>
            </div>
        `;

        // Atar manejadores de eventos
        this.initCatalogEvents(absoluteMaxPrice);
        // Render inicial de productos
        this.filterAndRenderProducts();
    },

    initCatalogEvents: function(absoluteMaxPrice) {
        const grid = document.getElementById("catalogGrid");
        const searchInput = document.getElementById("searchInput");
        const sortSelect = document.getElementById("sortSelect");
        const priceRange = document.getElementById("priceRange");
        const priceVal = document.getElementById("priceVal");
        const clearBtn = document.getElementById("clearFiltersBtn");

        // Evento Buscador
        searchInput.addEventListener("input", (e) => {
            this.activeFilters.search = e.target.value;
            this.filterAndRenderProducts();
        });

        // Evento Ordenamiento
        sortSelect.addEventListener("change", (e) => {
            this.activeFilters.sortBy = e.target.value;
            this.filterAndRenderProducts();
        });

        // Evento Slider Precio
        priceRange.addEventListener("input", (e) => {
            const val = e.target.value;
            this.activeFilters.maxPrice = parseFloat(val);
            priceVal.textContent = `$${new Intl.NumberFormat('es-AR').format(val)}`;
            this.filterAndRenderProducts();
        });

        // Eventos Categorías (Checkboxes)
        const catCheckboxes = document.querySelectorAll(".cat-filter");
        catCheckboxes.forEach(cb => {
            cb.addEventListener("change", () => {
                const checked = [];
                document.querySelectorAll(".cat-filter:checked").forEach(box => {
                    checked.push(box.value);
                });
                this.activeFilters.categories = checked;
                this.filterAndRenderProducts();
            });
        });

        // Evento Colores (Swatches)
        const colFilters = document.querySelectorAll(".col-filter");
        colFilters.forEach(swatch => {
            swatch.addEventListener("click", (e) => {
                const col = swatch.getAttribute("data-color");
                
                if (swatch.classList.contains("active")) {
                    swatch.classList.remove("active");
                    this.activeFilters.colors = this.activeFilters.colors.filter(c => c !== col);
                } else {
                    swatch.classList.add("active");
                    this.activeFilters.colors.push(col);
                }
                
                this.filterAndRenderProducts();
            });
        });

        // Evento Solo Ofertas
        const saleFilter = document.getElementById("saleFilter");
        if (saleFilter) {
            saleFilter.addEventListener("change", (e) => {
                this.activeFilters.onlyOnSale = e.target.checked;
                this.filterAndRenderProducts();
            });
        }

        // Evento Limpiar Filtros
        clearBtn.addEventListener("click", () => {
            // Resetear inputs de la UI
            searchInput.value = "";
            priceRange.value = absoluteMaxPrice;
            priceVal.textContent = `$${new Intl.NumberFormat('es-AR').format(absoluteMaxPrice)}`;
            sortSelect.value = "featured";
            
            document.querySelectorAll(".cat-filter").forEach(cb => cb.checked = false);
            document.querySelectorAll(".col-filter").forEach(s => s.classList.remove("active"));
            if (saleFilter) saleFilter.checked = false;

            // Resetear estado del filtro
            this.activeFilters = {
                search: "",
                categories: [],
                colors: [],
                maxPrice: absoluteMaxPrice,
                sortBy: "featured",
                onlyOnSale: false
            };

            this.filterAndRenderProducts();
        });
    },

    filterAndRenderProducts: function() {
        const grid = document.getElementById("catalogGrid");
        if (!grid) return;

        let filtered = window.state.getProducts();

        // 1. Filtrar por Buscador (Título o Descripción)
        if (this.activeFilters.search.trim()) {
            const query = this.activeFilters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        // 2. Filtrar por Categorías
        if (this.activeFilters.categories.length > 0) {
            filtered = filtered.filter(p => this.activeFilters.categories.includes(p.category));
        }

        // 2.5 Filtrar por Ofertas
        if (this.activeFilters.onlyOnSale) {
            filtered = filtered.filter(p => p.onSale && p.salePrice > 0);
        }

        // 3. Filtrar por Precio
        filtered = filtered.filter(p => {
            const currentPrice = (p.onSale && p.salePrice > 0) ? p.salePrice : p.price;
            return currentPrice <= this.activeFilters.maxPrice;
        });

        // 4. Filtrar por Colores (si el producto contiene alguno de los colores seleccionados)
        if (this.activeFilters.colors.length > 0) {
            filtered = filtered.filter(p => {
                if (!p.colors) return false;
                // Compara si hay alguna coincidencia de color parcial
                return p.colors.some(col => 
                    this.activeFilters.colors.some(fc => 
                        col.toLowerCase().includes(fc.toLowerCase())
                    )
                );
            });
        }

        // 5. Ordenamiento
        if (this.activeFilters.sortBy === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (this.activeFilters.sortBy === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (this.activeFilters.sortBy === "name-asc") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            // "featured" default (destacados primero y luego por orden original)
            filtered.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });
        }

        // Renderizar en la grilla
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1;">
                    <i data-lucide="package-search"></i>
                    <h3>No encontramos productos</h3>
                    <p style="margin-top: 0.5rem;">Intenta quitar algunos filtros o cambiar el término de búsqueda.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let cardsHtml = "";
        filtered.forEach(p => {
            cardsHtml += window.components.renderProductCard(p);
        });
        grid.innerHTML = cardsHtml;

        if (window.lucide) window.lucide.createIcons();
    }
};
