/**
 * SUMMER QUEEN - VISTA CONTACTO Y CHAT DE SOPORTE
 */

window.views.contact = {
    render: function(container, param, query) {
        const settings = window.state.getContactSettings() || { email: "consultas@summerqueen.com", whatsapp: "5491122334455" };

        container.innerHTML = `
            <div class="container contact-view">
                <div class="section-header" style="justify-content: center; text-align: center; margin-bottom: 4rem;">
                    <div class="section-header-title">
                        <h1 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 0.5rem;">Contacto & Soporte</h1>
                        <p>¿Tienen dudas sobre talles, pedidos grupales de egresados o envíos? Escríbannos.</p>
                    </div>
                </div>

                <div class="contact-layout">
                    <!-- COL 1: INFORMACION DE CONTACTO -->
                    <div class="contact-details-panel">
                        <div class="contact-card">
                            <div class="contact-card-icon">
                                <i data-lucide="phone"></i>
                            </div>
                            <div class="contact-card-info">
                                <h3>Atención Telefónica / WhatsApp</h3>
                                <p style="font-weight: 600; color: var(--color-text-primary); margin: 0.2rem 0;">+${settings.whatsapp}</p>
                                <p>Lunes a Viernes de 9:00 a 18:00 hs.</p>
                            </div>
                        </div>

                        <div class="contact-card">
                            <div class="contact-card-icon">
                                <i data-lucide="map-pin"></i>
                            </div>
                            <div class="contact-card-info">
                                <h3>Showroom y Taller</h3>
                                <p style="font-weight: 600; color: var(--color-text-primary); margin: 0.2rem 0;">Av. Scalabrini Ortiz 2400</p>
                                <p>Palermo, CABA, Argentina (Con cita previa)</p>
                            </div>
                        </div>

                        <div class="contact-card">
                            <div class="contact-card-icon">
                                <i data-lucide="mail"></i>
                            </div>
                            <div class="contact-card-info">
                                <h3>Correo Electrónico</h3>
                                <p style="font-weight: 600; color: var(--color-text-primary); margin: 0.2rem 0;">${settings.email}</p>
                                <p>Soporte Oficial Summer Queen</p>
                            </div>
                        </div>
                        
                        <!-- CHAT BOT DE SOPORTE INTERACTIVO (WOW FACTOR) -->
                        <div class="contact-card" style="flex-direction: column; gap: 1rem; border-color: var(--color-primary-light);">
                            <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                                <div class="contact-card-icon" style="background-color: var(--color-primary); color: var(--color-text-inv);">
                                    <i data-lucide="bot"></i>
                                </div>
                                <div class="contact-card-info">
                                    <h3>Asistente Virtual 🧵</h3>
                                    <p>Chatea en tiempo real para resolver dudas rápidas</p>
                                </div>
                            </div>
                            
                            <!-- Ventanita de Chat simulada -->
                            <div id="simulatedChat" style="width: 100%; border: 1px solid var(--color-border); border-radius: var(--border-radius-md); background-color: var(--color-input); overflow: hidden; display: flex; flex-direction: column; height: 260px;">
                                <div style="background-color: var(--color-bg-alt); padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-success);"></span>
                                    Soporte Summer Queen (En línea)
                                </div>
                                <div id="chatMessages" style="flex-grow: 1; padding: 1rem; overflow-y: auto; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.8rem;">
                                    <div style="align-self: flex-start; background-color: var(--color-card); padding: 0.5rem 0.8rem; border-radius: 4px 12px 12px 12px; max-width: 85%;">
                                        ¡Hola! Soy el asistente virtual de Summer Queen. Escribe el número de tu opción:<br><br>
                                        <strong>1.</strong> Consultar estado de pedido<br>
                                        <strong>2.</strong> Presupuesto ropa de egresados<br>
                                        <strong>3.</strong> Medios de envío y plazos
                                    </div>
                                </div>
                                <div style="display: flex; border-top: 1px solid var(--color-border);">
                                    <input type="text" id="chatInput" placeholder="Escribe un mensaje o número..." style="flex-grow: 1; border: none; padding: 0.8rem; font-size: 0.85rem; background-color: transparent; color: var(--color-text-primary); outline: none;">
                                    <button id="chatSendBtn" style="background: none; border: none; padding: 0 1rem; color: var(--color-primary); cursor: pointer;">
                                        <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- COL 2: FORMULARIO DE CONSULTAS -->
                    <div class="contact-form-panel">
                        <h2>Envíanos un Mensaje</h2>
                        <form id="contactForm" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div class="form-group">
                                <label class="form-label" for="conName">Nombre y Apellido *</label>
                                <input type="text" id="conName" class="form-control" placeholder="Ariel Confección" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="conEmail">Correo Electrónico *</label>
                                <input type="email" id="conEmail" class="form-control" placeholder="ejemplo@correo.com" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="conPhone">Número de Teléfono / WhatsApp *</label>
                                <input type="tel" id="conPhone" class="form-control" placeholder="Ej: +54 9 11 5566-7788" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="conSubject">Asunto *</label>
                                <select id="conSubject" class="form-control" required>
                                    <option value="" disabled selected>Selecciona un motivo</option>
                                    <option value="egresados">Presupuesto Ropa de Egresados</option>
                                    <option value="mochilas">Consulta sobre Mochilas / Stock</option>
                                    <option value="pedido">Consulta sobre un Pedido Realizado</option>
                                    <option value="taller">Alianzas comerciales / Taller</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="conMessage">Mensaje *</label>
                                <textarea id="conMessage" class="form-control" rows="5" placeholder="Escribe detalladamente tu consulta..." required></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary" style="margin-top: 1rem; align-self: flex-start;">
                                Enviar Consulta <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.initContactEvents();
    },

    initContactEvents: function() {
        const contactForm = document.getElementById("contactForm");
        const chatInput = document.getElementById("chatInput");
        const chatSendBtn = document.getElementById("chatSendBtn");
        const chatMessages = document.getElementById("chatMessages");

        // Evento Formulario de Contacto
        if (contactForm) {
            contactForm.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const name = document.getElementById("conName").value;
                const email = document.getElementById("conEmail").value;
                const phone = document.getElementById("conPhone").value;
                const subjectVal = document.getElementById("conSubject").value;
                const message = document.getElementById("conMessage").value;
                
                // Buscar nombre legible del asunto
                const subjectMap = {
                    egresados: "Presupuesto Ropa de Egresados",
                    mochilas: "Consulta sobre Mochilas / Stock",
                    pedido: "Consulta sobre un Pedido Realizado",
                    taller: "Alianzas comerciales / Taller"
                };
                const subject = subjectMap[subjectVal] || subjectVal;

                // Guardar en base de datos local
                window.state.addMessage({ name, email, phone, subject, message });
                window.components.showToast("Consulta enviada y registrada en el panel", "success");

                // Configuración de destino
                const settings = window.state.getContactSettings() || { email: "consultas@summerqueen.com", whatsapp: "5491122334455" };

                // Configurar textos y links
                const textWa = `Hola! Mi nombre es ${name} (Tel: ${phone}, Email: ${email}). Escribo por la consulta: "${subject}". Mensaje: ${message}`;
                const encodedText = encodeURIComponent(textWa);
                const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsapp}&text=${encodedText}`;

                const emailSubject = `Consulta de ${name} - ${subject}`;
                const emailBody = `Nombre: ${name}\nTeléfono: ${phone}\nEmail: ${email}\n\nMensaje:\n${message}`;
                const mailtoUrl = `mailto:${settings.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

                // Ejecutar envíos automáticos
                // WhatsApp en pestaña nueva
                window.open(waUrl, "_blank");
                // Mailto en la ventana actual (no cambia la página, solo abre el cliente de correo)
                window.location.href = mailtoUrl;

                contactForm.reset();
            });
        }

        // Lógica del Chat Bot
        const appendMessage = (text, sender) => {
            const msg = document.createElement("div");
            if (sender === "user") {
                msg.style.alignSelf = "flex-end";
                msg.style.backgroundColor = "var(--color-primary-light)";
                msg.style.color = "var(--color-text-primary)";
                msg.style.borderRadius = "12px 12px 4px 12px";
            } else {
                msg.style.alignSelf = "flex-start";
                msg.style.backgroundColor = "var(--color-card)";
                msg.style.borderRadius = "4px 12px 12px 12px";
            }
            msg.style.padding = "0.5rem 0.8rem";
            msg.style.maxWidth = "85%";
            msg.innerHTML = text;
            
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const handleChatSubmit = () => {
            const query = chatInput.value.trim();
            if (!query) return;

            appendMessage(query, "user");
            chatInput.value = "";

            // Simular typing de bot
            setTimeout(() => {
                let response = "";
                const cleanQuery = query.toLowerCase();

                if (cleanQuery === "1" || cleanQuery.includes("pedido") || cleanQuery.includes("estado")) {
                    response = `Para ver el estado de tu pedido, ingresa al panel de administración o dinos tu número de orden (ej: <strong>ord-1002</strong>). Los pedidos en confección tardan entre 10 y 15 días hábiles.`;
                } else if (cleanQuery === "2" || cleanQuery.includes("egresados") || cleanQuery.includes("presupuesto") || cleanQuery.includes("buzo")) {
                    response = `¡Excelente! Para presupuestos de buzos de egresados trabajamos con descuentos grupales. Dinos qué cantidad necesitan o comunícate directamente con un asesor de ventas al WhatsApp: <strong>+54 9 11 2233-4455</strong>.`;
                } else if (cleanQuery === "3" || cleanQuery.includes("envio") || cleanQuery.includes("plazo") || cleanQuery.includes("correo")) {
                    response = `Realizamos envíos a todo el país a través de Correo Argentino y OCA. Los costos se calculan en el checkout. El tiempo de envío postal es de 3 a 5 días hábiles luego del despacho del taller.`;
                } else if (cleanQuery.startsWith("ord-")) {
                    // Buscar pedido simulado
                    const orderId = cleanQuery.split(" ")[0];
                    const orders = window.state.getOrders();
                    const match = orders.find(o => o.id.toLowerCase() === orderId);
                    if (match) {
                        let statusText = "Pendiente";
                        if (match.status === "inprogress") statusText = "En Proceso (Taller)";
                        if (match.status === "shipped") statusText = "Enviado por Correo";
                        if (match.status === "delivered") statusText = "Entregado";
                        response = `¡Encontré tu orden! El pedido <strong>${match.id}</strong> a nombre de <strong>${match.client.name}</strong> está actualmente: <strong style="color:var(--color-primary);">${statusText}</strong>.`;
                    } else {
                        response = `No encontré ningún pedido con el código <strong>${query}</strong> en nuestra base de datos. Verifica el código e intenta de nuevo.`;
                    }
                } else {
                    response = `Entiendo. Si tienes una consulta específica de diseño, telas o te gustaría enviarnos tu boceto, escríbenos a <strong>ventas@summerqueen.com</strong> o elige una opción escribiendo su número (1, 2 o 3).`;
                }

                appendMessage(response, "bot");
                if (window.lucide) window.lucide.createIcons();
            }, 800);
        };

        if (chatInput) {
            chatInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleChatSubmit();
            });
        }
        if (chatSendBtn) {
            chatSendBtn.addEventListener("click", handleChatSubmit);
        }
    }
};
