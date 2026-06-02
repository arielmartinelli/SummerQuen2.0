/**
 * SUMMER QUEEN - VISTA CHECKOUT (PROCESO DE PEDIDO Y PAGO)
 */

window.views.checkout = {
    render: function(container, param, query) {
        const cart = window.state.getCart();
        
        // Si el carrito está vacío, redirigir o mostrar advertencia
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="container" style="padding: 5rem 2rem; text-align: center;">
                    <i data-lucide="shopping-bag" style="width: 64px; height: 64px; opacity: 0.3; margin-bottom: 1.5rem;"></i>
                    <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 1rem;">Tu carrito está vacío</h2>
                    <p style="color: var(--color-text-muted); margin-bottom: 2rem;">No tienes ningún producto en tu carrito para iniciar el pago.</p>
                    <a href="#/catalog" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Estado del método de pago seleccionado
        this.selectedPaymentMethod = "credit_card";

        // Renderizar layout
        this.renderLayout(container, cart);
    },

    renderLayout: function(container, cart) {
        const totals = window.state.getCartTotals();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

        // Detalle de productos en el checkout
        let itemsSummaryHtml = "";
        cart.forEach(item => {
            let variantDetails = "";
            if (item.color) variantDetails += `Color: ${item.color}`;
            if (item.size) variantDetails += (variantDetails ? ", " : "") + `Talle: ${item.size}`;
            
            itemsSummaryHtml += `
                <div class="checkout-summary-item">
                    <div class="checkout-summary-info">
                        <span class="checkout-summary-name">${item.title}</span>
                        <span class="checkout-summary-qty">Cantidad: ${item.quantity} | ${variantDetails}</span>
                    </div>
                    <span class="checkout-summary-price">${formatter.format(item.price * item.quantity)}</span>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="container checkout-view">
                <h1 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 2rem;">Proceso de Pedido</h1>
                
                <div class="checkout-layout">
                    <!-- COL 1: FORMULARIOS -->
                    <div>
                        <!-- DATOS DE ENVÍO -->
                        <form id="checkoutForm" class="checkout-billing">
                            <h2 class="checkout-section-title">Datos de Envío & Contacto</h2>
                            
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="chkName">Nombre Completo *</label>
                                    <input type="text" id="chkName" class="form-control" placeholder="Juan Pérez" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="chkEmail">Correo Electrónico *</label>
                                    <input type="email" id="chkEmail" class="form-control" placeholder="juan.perez@example.com" required>
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="chkPhone">Teléfono de Contacto *</label>
                                    <input type="tel" id="chkPhone" class="form-control" placeholder="+54 9 11 1234-5678" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="chkAddress">Dirección Completa *</label>
                                    <input type="text" id="chkAddress" class="form-control" placeholder="Av. Cabildo 1500, 3° A" required>
                                </div>
                            </div>

                            <div class="form-grid" style="grid-template-columns: 2fr 1fr;">
                                <div class="form-group">
                                    <label class="form-label" for="chkCity">Ciudad / Localidad *</label>
                                    <input type="text" id="chkCity" class="form-control" placeholder="Belgrano, CABA" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="chkZip">Código Postal *</label>
                                    <input type="text" id="chkZip" class="form-control" placeholder="C1426" required>
                                </div>
                            </div>

                            <!-- FORMA DE PAGO -->
                            <h2 class="checkout-section-title" style="margin-top: 3rem;">Forma de Pago</h2>
                            <div class="payment-method-selector">
                                <div class="payment-method-card active" data-method="credit_card">
                                    <i data-lucide="credit-card"></i>
                                    <span>Tarjeta Cred/Deb</span>
                                </div>
                                <div class="payment-method-card" data-method="bank_transfer">
                                    <i data-lucide="landmark"></i>
                                    <span>Transferencia</span>
                                </div>
                                <div class="payment-method-card" data-method="paypal">
                                    <i data-lucide="wallet"></i>
                                    <span>PayPal</span>
                                </div>
                            </div>

                            <!-- CONTENEDORES DE PAGO DINÁMICOS -->
                            <div id="paymentDetailsContainer">
                                <!-- Tarjeta de crédito (Por defecto) -->
                                <div id="payCreditCard">
                                    <div class="credit-card-simulation">
                                        <div class="credit-card-chip"></div>
                                        <div class="credit-card-number" id="cardSimNum">•••• •••• •••• ••••</div>
                                        <div class="credit-card-details">
                                            <div>
                                                <div class="credit-card-label">Titular</div>
                                                <div class="credit-card-val" id="cardSimName">NOMBRE APELLIDO</div>
                                            </div>
                                            <div>
                                                <div class="credit-card-label">Vencimiento</div>
                                                <div class="credit-card-val" id="cardSimExpiry">MM/AA</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label" for="cardNum">Número de Tarjeta *</label>
                                        <input type="text" id="cardNum" class="form-control" placeholder="4517 8412 9012 3456" maxlength="19" required>
                                    </div>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label class="form-label" for="cardName">Nombre Impreso en Tarjeta *</label>
                                            <input type="text" id="cardName" class="form-control" placeholder="JUAN PEREZ" required>
                                        </div>
                                        <div class="form-grid" style="gap: 1rem;">
                                            <div class="form-group">
                                                <label class="form-label" for="cardExpiry">Vencimiento *</label>
                                                <input type="text" id="cardExpiry" class="form-control" placeholder="MM/AA" maxlength="5" required>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label" for="cardCvv">CVC/CVV *</label>
                                                <input type="password" id="cardCvv" class="form-control" placeholder="123" maxlength="4" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Transferencia bancaria -->
                                <div id="payBankTransfer" style="display: none;">
                                    <div class="bank-transfer-details">
                                        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Datos para Transferencia Bancaria</h3>
                                        <p>Por favor transfiera el importe total a la siguiente cuenta y envíe el comprobante por Whatsapp o Email.</p>
                                        <p><strong>Banco:</strong> Banco de la Nación Argentina (BNA)</p>
                                        <p><strong>CBU:</strong> 0110599540000123456789</p>
                                        <p><strong>Alias:</strong> SUMMER.QUEEN.CONFEC</p>
                                        <p><strong>Titular:</strong> Summer Queen Confección S.R.L.</p>
                                        <p><strong>CUIT:</strong> 30-71123456-9</p>
                                    </div>
                                </div>

                                <!-- PayPal -->
                                <div id="payPaypal" style="display: none; text-align: center; padding: 2rem; background-color: var(--color-bg-alt); border-radius: var(--border-radius-md); border: 1px solid var(--color-border);">
                                    <i data-lucide="wallet" style="width: 48px; height: 48px; color: #003087; margin-bottom: 1rem;"></i>
                                    <h3>Pago Seguro con PayPal</h3>
                                    <p style="color: var(--color-text-muted); margin-bottom: 1.5rem; max-width: 320px; margin-left: auto; margin-right: auto;">Serás redirigido al portal de PayPal al hacer clic en Completar Pedido.</p>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 2rem; padding: 1.2rem;">
                                <i data-lucide="shield-check"></i> Completar Pedido y Pagar
                            </button>
                        </form>
                    </div>

                    <!-- COL 2: RESUMEN DE COMPRA -->
                    <aside class="checkout-summary-panel">
                        <h2 class="checkout-section-title">Resumen de Compra</h2>
                        
                        <!-- Listado de productos -->
                        <div style="max-height: 350px; overflow-y: auto; margin-bottom: 2rem; padding-right: 0.5rem;">
                            ${itemsSummaryHtml}
                        </div>

                        <!-- Cuentas -->
                        <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                            <div class="cart-totals">
                                <span>Subtotal:</span>
                                <span>${formatter.format(totals.subtotal)}</span>
                            </div>
                            
                            ${totals.discount > 0 ? `
                            <div class="cart-totals discount-row">
                                <span>Descuento (${(window.state.getDiscountRate()*100)}%):</span>
                                <span>-${formatter.format(totals.discount)}</span>
                            </div>
                            ` : ''}

                            <div class="cart-totals">
                                <span>Impuesto (21% IVA):</span>
                                <span>${formatter.format(totals.tax)}</span>
                            </div>

                            <div class="cart-totals total-row">
                                <span>Total a Pagar:</span>
                                <span>${formatter.format(totals.total)}</span>
                            </div>
                        </div>

                        <!-- Garantía y Seguridad -->
                        <div style="margin-top: 2rem; padding: 1rem; border: 1px dashed var(--color-border); border-radius: var(--border-radius-md); font-size: 0.85rem; color: var(--color-text-muted); display: flex; flex-direction: column; gap: 0.5rem;">
                            <span style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-primary); font-weight: 600;">
                                <i data-lucide="lock" style="width: 16px; height: 16px; color: var(--color-success);"></i> Transacción Encriptada SSL
                            </span>
                            Tus datos personales y bancarios están totalmente protegidos. Summer Queen no almacena información de tarjetas de crédito.
                        </div>
                    </aside>
                </div>
            </div>
        `;

        this.initCheckoutEvents(container);
    },

    initCheckoutEvents: function(container) {
        const methodCards = container.querySelectorAll(".payment-method-card");
        const payCreditCard = document.getElementById("payCreditCard");
        const payBankTransfer = document.getElementById("payBankTransfer");
        const payPaypal = document.getElementById("payPaypal");
        
        // Elementos del formulario de tarjeta para interactuar con la tarjeta simulada
        const cardNumInput = document.getElementById("cardNum");
        const cardNameInput = document.getElementById("cardName");
        const cardExpiryInput = document.getElementById("cardExpiry");
        
        const cardSimNum = document.getElementById("cardSimNum");
        const cardSimName = document.getElementById("cardSimName");
        const cardSimExpiry = document.getElementById("cardSimExpiry");

        const checkoutForm = document.getElementById("checkoutForm");

        // Cambiar métodos de pago
        methodCards.forEach(card => {
            card.addEventListener("click", () => {
                methodCards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                
                const method = card.getAttribute("data-method");
                this.selectedPaymentMethod = method;

                // Mostrar ocultar formularios
                payCreditCard.style.display = "none";
                payBankTransfer.style.display = "none";
                payPaypal.style.display = "none";

                // Desactivar temporalmente los campos requeridos del formulario de tarjeta si no se usa
                const cardInputs = payCreditCard.querySelectorAll("input");
                
                if (method === "credit_card") {
                    payCreditCard.style.display = "block";
                    cardInputs.forEach(i => i.required = true);
                } else if (method === "bank_transfer") {
                    payBankTransfer.style.display = "block";
                    cardInputs.forEach(i => i.required = false);
                } else if (method === "paypal") {
                    payPaypal.style.display = "block";
                    cardInputs.forEach(i => i.required = false);
                }
            });
        });

        // Simulación interactiva de tarjeta de crédito
        if (cardNumInput) {
            cardNumInput.addEventListener("input", (e) => {
                // Formatear en bloques de 4 dígitos
                let val = e.target.value.replace(/\D/g, '');
                let formatted = "";
                for (let i = 0; i < val.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += " ";
                    formatted += val[i];
                }
                e.target.value = formatted;
                cardSimNum.textContent = formatted || "•••• •••• •••• ••••";
            });
        }

        if (cardNameInput) {
            cardNameInput.addEventListener("input", (e) => {
                cardSimName.textContent = e.target.value.toUpperCase() || "NOMBRE APELLIDO";
            });
        }

        if (cardExpiryInput) {
            cardExpiryInput.addEventListener("input", (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length >= 2) {
                    e.target.value = val.slice(0, 2) + "/" + val.slice(2, 4);
                } else {
                    e.target.value = val;
                }
                cardSimExpiry.textContent = e.target.value || "MM/AA";
            });
        }

        // Enviar pedido
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Capturar datos de envío
            const clientInfo = {
                name: document.getElementById("chkName").value,
                email: document.getElementById("chkEmail").value,
                phone: document.getElementById("chkPhone").value,
                address: `${document.getElementById("chkAddress").value}, ${document.getElementById("chkCity").value} (CP: ${document.getElementById("chkZip").value})`
            };

            // Crear la orden en el State
            const order = window.state.createOrder(clientInfo, this.selectedPaymentMethod);
            
            if (order) {
                // Mostrar pantalla de éxito
                this.renderSuccessScreen(container, order);
                window.components.showToast("¡Pedido confirmado con éxito!", "success");
            } else {
                window.components.showToast("Error procesando el pedido", "error");
            }
        });
    },

    renderSuccessScreen: function(container, order) {
        container.innerHTML = `
            <div class="container">
                <div class="order-success-screen">
                    <div class="order-success-icon">
                        <i data-lucide="check"></i>
                    </div>
                    <h1>¡Pedido Recibido!</h1>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Muchas gracias por tu compra, <strong>${order.client.name}</strong>.</p>
                    <p>Hemos registrado tu pedido con el código <strong>${order.id}</strong>. Enviamos un correo de confirmación a <strong>${order.client.email}</strong> con el detalle y seguimiento.</p>
                    
                    <div style="background-color: var(--color-bg-alt); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--color-border); margin: 2rem 0; text-align: left;">
                        <h4 style="margin-bottom: 0.5rem;">Detalles del Pedido:</h4>
                        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.3rem;"><strong>Total abonado:</strong> $${new Intl.NumberFormat('es-AR').format(order.total)} (IVA incl.)</p>
                        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.3rem;"><strong>Forma de pago:</strong> ${this.getPaymentMethodLabel(order.paymentMethod)}</p>
                        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.3rem;"><strong>Dirección de entrega:</strong> ${order.client.address}</p>
                        <p style="font-size: 0.9rem; color: var(--color-text-muted);"><strong>Estado del pedido:</strong> <span class="status-badge status-pending" style="font-size:0.65rem;">Pendiente</span></p>
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <a href="#/" class="btn btn-primary">Volver al Inicio</a>
                        <a href="#/catalog" class="btn btn-outline">Seguir Comprando</a>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    },

    getPaymentMethodLabel: function(method) {
        if (method === "credit_card") return "Tarjeta de Crédito / Débito";
        if (method === "bank_transfer") return "Transferencia Bancaria";
        if (method === "paypal") return "PayPal";
        return method;
    }
};
