/**
 * SUMMERQUEN - VISTA INICIO (HOME)
 */

window.views.home = {
    render: function(container, param, query) {
        // Obtener productos destacados
        const products = window.state.getProducts();
        const featuredProducts = products.filter(p => p.featured || p.stock < 10).slice(0, 4);

        // Renderizar estructura básica
        container.innerHTML = `
            <!-- Hero Slider -->
            <section class="hero-slider" id="heroSlider">
                <div class="hero-slide active" style="background-image: url('${window.state.getProducts()[0].image}');">
                    <div class="hero-content container">
                        <span class="hero-tag">Temporada 2026</span>
                        <h1 class="hero-title">Ropa de Egresados a tu Medida</h1>
                        <p class="hero-desc">Buzos, camperas y chombas diseñadas con materiales premium de confección nacional. Vistan su identidad de una manera única.</p>
                        <a href="#/catalog?category=egresados" class="btn btn-primary">Ver Ropa de Egresados</a>
                    </div>
                </div>
                <div class="hero-slide" style="background-image: url('${window.state.getProducts()[3].image}');">
                    <div class="hero-content container">
                        <span class="hero-tag">Edición Limitada</span>
                        <h1 class="hero-title">Mochilas de Diseño Urbano</h1>
                        <p class="hero-desc">Materiales impermeables de alta densidad y compartimentos técnicos. Diseñadas para resistir el paso del tiempo en la gran ciudad.</p>
                        <a href="#/catalog?category=mochilas" class="btn btn-primary">Colección Mochilas</a>
                    </div>
                </div>
                <div class="hero-slide" style="background-image: url('${window.state.getProducts()[5].image}');">
                    <div class="hero-content container">
                        <span class="hero-tag">Detalles Únicos</span>
                        <h1 class="hero-title">Accesorios de Alta Calidad</h1>
                        <p class="hero-desc">Snapbacks bordadas 3D, pilusos reversibles y cartucheras duraderas en canvas de algodón. Completa tu kit escolar.</p>
                        <a href="#/catalog?category=accesorios" class="btn btn-primary">Ver Accesorios</a>
                    </div>
                </div>
                
                <!-- Navegación del Hero -->
                <div class="hero-nav">
                    <button class="icon-btn" id="heroPrevBtn" aria-label="Anterior">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    <button class="icon-btn" id="heroNextBtn" aria-label="Siguiente">
                        <i data-lucide="chevron-right"></i>
                    </button>
                </div>
            </section>

            <!-- Categorías Promocionales -->
            <section class="container" style="margin-bottom: 5rem;">
                <div class="section-header" style="justify-content: center; text-align: center; align-items: center;">
                    <div class="section-header-title">
                        <h2>Nuestras Especialidades</h2>
                        <p style="margin-top: 0.5rem;">Cuidamos cada costura, detalle y terminación para ofrecer prendas y accesorios excepcionales.</p>
                    </div>
                </div>
                <div class="category-promos">
                    <div class="promo-card">
                        <img src="${window.state.getProducts()[0].image}" alt="Egresados">
                        <div class="promo-content">
                            <h3>Ropa de Egresados</h3>
                            <p>Buzos y camperas de diseño exclusivo</p>
                            <a href="#/catalog?category=egresados" class="btn btn-outline btn-sm" style="color: white; border-color: white;">Explorar</a>
                        </div>
                    </div>
                    <div class="promo-card">
                        <img src="${window.state.getProducts()[3].image}" alt="Mochilas">
                        <div class="promo-content">
                            <h3>Mochilas Técnicas</h3>
                            <p>Funcionalidad y materiales premium para el día a día</p>
                            <a href="#/catalog?category=mochilas" class="btn btn-outline btn-sm" style="color: white; border-color: white;">Ver Modelos</a>
                        </div>
                    </div>
                    <div class="promo-card">
                        <img src="${window.state.getProducts()[5].image}" alt="Accesorios">
                        <div class="promo-content">
                            <h3>Accesorios y Caps</h3>
                            <p>El complemento ideal de tu confección</p>
                            <a href="#/catalog?category=accesorios" class="btn btn-outline btn-sm" style="color: white; border-color: white;">Ver Todos</a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Productos Destacados -->
            <section class="container" style="margin-bottom: 6rem;">
                <div class="section-header">
                    <div class="section-header-title">
                        <h2>Productos Destacados</h2>
                        <p>Los artículos más elegidos de nuestra comunidad esta semana.</p>
                    </div>
                    <a href="#/catalog" class="btn btn-outline">Ver Todo el Catálogo <i data-lucide="arrow-right" style="width:16px; height: 16px;"></i></a>
                </div>
                
                <div class="featured-grid" id="featuredGrid">
                    <!-- Cards se renderizan dinámicamente -->
                </div>
            </section>

            <!-- Banner Promocional Estilo Confección -->
            <section style="background-color: var(--color-bg-alt); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 5rem 0; margin-bottom: 6rem;">
                <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                    <div style="aspect-ratio: 1.5/1; border-radius: var(--border-radius-lg); overflow: hidden; background-color: var(--color-card); border: 1px solid var(--color-border);">
                        <img src="${window.state.getProductById("prod-2").image}" alt="Taller de Confección" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div>
                        <span style="color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px;">Taller de Elaboración Propia</span>
                        <h2 style="font-family: var(--font-heading); font-size: 2.5rem; line-height: 1.2; margin: 1rem 0 1.5rem;">Calidad Artesanal & Diseño Moderno</h2>
                        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Cada una de nuestras mochilas y buzos de egresados se elabora a mano en nuestro taller. Seleccionamos cuidadosamente las telas, hilos y herrajes metálicos para garantizar que resistan el uso escolar y los viajes más intensos.</p>
                        <ul style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem;">
                            <li style="display: flex; align-items: center; gap: 0.8rem; color: var(--color-text-primary); font-weight: 500;"><i data-lucide="check-circle-2" style="color: var(--color-success); width: 20px; height: 20px;"></i> Costuras reforzadas de alta tenacidad</li>
                            <li style="display: flex; align-items: center; gap: 0.8rem; color: var(--color-text-primary); font-weight: 500;"><i data-lucide="check-circle-2" style="color: var(--color-success); width: 20px; height: 20px;"></i> Estampado y bordado de alta fidelidad</li>
                            <li style="display: flex; align-items: center; gap: 0.8rem; color: var(--color-text-primary); font-weight: 500;"><i data-lucide="check-circle-2" style="color: var(--color-success); width: 20px; height: 20px;"></i> Garantía de confección por 6 meses</li>
                        </ul>
                        <a href="#/contact" class="btn btn-primary">Hacer una Consulta</a>
                    </div>
                </div>
            </section>
        `;

        // Renderizar los productos destacados en la grilla
        const grid = document.getElementById("featuredGrid");
        if (grid) {
            let cardsHtml = "";
            featuredProducts.forEach(prod => {
                cardsHtml += window.components.renderProductCard(prod);
            });
            grid.innerHTML = cardsHtml;
        }

        // Inicializar lógica de slider
        this.initSlider();
    },

    initSlider: function() {
        const slider = document.getElementById("heroSlider");
        if (!slider) return;

        const slides = slider.querySelectorAll(".hero-slide");
        const prevBtn = document.getElementById("heroPrevBtn");
        const nextBtn = document.getElementById("heroNextBtn");
        
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove("active"));
            
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add("active");
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        // Event listeners
        if (nextBtn) nextBtn.addEventListener("click", () => {
            nextSlide();
            resetInterval();
        });
        if (prevBtn) prevBtn.addEventListener("click", () => {
            prevSlide();
            resetInterval();
        });

        // Auto slider
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 6000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }
};
