/**
 * SUMMER QUEEN - VISTA GUÍA DE TALLES
 */

window.views = window.views || {};

window.views.sizes = {
    render: function(container, param, query) {
        container.innerHTML = `
            <div class="container" style="padding-top: 3rem; padding-bottom: 6rem;">
                <!-- Header de la sección -->
                <div style="text-align: center; margin-bottom: 4rem;">
                    <span style="color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px;">Medidas de Confección</span>
                    <h1 style="font-family: var(--font-heading); font-size: 3rem; margin: 0.5rem 0 1rem;">Guía de Talles</h1>
                    <p style="color: var(--color-text-muted); max-width: 600px; margin: 0 auto; font-size: 1.05rem;">
                        Encuentren la medida perfecta para sus prendas. Coloquen una remera de uso habitual sobre una superficie plana y midan siguiendo las indicaciones.
                    </p>
                </div>

                <div class="sizes-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                    <!-- Columna 1: Ilustración -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                        <div style="background-color: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: 2rem; box-shadow: var(--shadow-md); max-width: 100%; display: flex; justify-content: center; align-items: center;">
                            <img src="assets/guia-talles.png" alt="Indicaciones de cómo medir ancho y largo de remera" style="max-width: 100%; height: auto; border-radius: var(--border-radius-sm); max-height: 420px; object-fit: contain;">
                        </div>
                        <div style="text-align: center; max-width: 400px; background-color: var(--color-bg-alt); padding: 1.2rem; border-radius: var(--border-radius-md); border: 1px solid var(--color-border);">
                            <h4 style="font-weight: 700; margin-bottom: 0.5rem; color: var(--color-primary);">¿Cómo tomar tus medidas?</h4>
                            <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.4; margin: 0;">
                                <strong>Ancho (Sisa a sisa):</strong> Medir horizontalmente de costura a costura debajo de las mangas.<br>
                                <strong>Largo:</strong> Medir verticalmente desde el punto más alto del hombro hasta el dobladillo inferior.
                            </p>
                        </div>
                    </div>

                    <!-- Columna 2: Tabla de Talles -->
                    <div>
                        <div class="admin-table-container" style="padding: 1.5rem; background-color: var(--color-card); border-radius: var(--border-radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
                            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; color: var(--color-text-primary);">
                                Remeras (Medidas en centímetros)
                            </h3>
                            <div style="overflow-x: auto;">
                                <table class="admin-table" style="text-align: center;">
                                    <thead>
                                        <tr>
                                            <th style="text-align: center; font-weight: 700; font-size: 0.95rem;">Talle</th>
                                            <th style="text-align: center; font-weight: 700; font-size: 0.95rem;">Ancho (cm)</th>
                                            <th style="text-align: center; font-weight: 700; font-size: 0.95rem;">Largo (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 2</span></td>
                                            <td>32 cm</td>
                                            <td>44 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 4</span></td>
                                            <td>35 cm</td>
                                            <td>46 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 6</span></td>
                                            <td>36 cm</td>
                                            <td>48 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 8</span></td>
                                            <td>38 cm</td>
                                            <td>51 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 10</span></td>
                                            <td>41 cm</td>
                                            <td>53 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 12</span></td>
                                            <td>43 cm</td>
                                            <td>55 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 14</span></td>
                                            <td>46 cm</td>
                                            <td>59 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 16</span></td>
                                            <td>50 cm</td>
                                            <td>67 cm</td>
                                        </tr>
                                        <tr>
                                            <td><span style="font-weight: 600; color: var(--color-primary);">Talle 18</span></td>
                                            <td>55 cm</td>
                                            <td>73 cm</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
