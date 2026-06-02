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
                window.state.addMessage({ name, email, subject, message, phone: "" });
                window.components.showToast("Consulta registrada en nuestro buzón local", "success");

                // Configuración de destino
                const settings = window.state.getContactSettings() || { email: "consultas@summerqueen.com", whatsapp: "5491122334455" };

                // Mostrar modal para seleccionar canal de comunicación
                const modal = document.createElement("div");
                modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;";
                
                modal.innerHTML = `
                    <div style="background: var(--color-card); border: 1px solid var(--color-border); padding: 2.5rem 2rem; border-radius: var(--border-radius-lg); max-width: 480px; width: 90%; text-align: center; box-shadow: var(--shadow-lg); transform: scale(0.9); transition: transform 0.3s ease;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-success-bg); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 0.5rem;">¡Consulta Registrada!</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Hemos guardado tu consulta en el panel. Para agilizar la respuesta, elige cómo deseas enviarla ahora:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <button id="sendWaBtn" class="btn btn-block" style="background-color: #25d366; color: white; border: none; font-weight: 600; justify-content: center; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Enviar por WhatsApp
                            </button>
                            <button id="sendEmailBtn" class="btn btn-block btn-primary" style="justify-content: center; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                Enviar por Correo Electrónico
                            </button>
                            <button id="closeContactModalBtn" class="btn btn-block btn-outline" style="justify-content: center; padding: 0.8rem; margin-top: 0.5rem;">
                                Cerrar Ventana
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Animar entrada
                setTimeout(() => {
                    modal.style.opacity = "1";
                    modal.children[0].style.transform = "scale(1)";
                }, 50);

                // Configurar textos y links
                const textWa = `Hola! Mi nombre es ${name} (${email}). Escribo por la consulta: "${subject}". Mensaje: ${message}`;
                const encodedText = encodeURIComponent(textWa);
                const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsapp}&text=${encodedText}`;

                const emailSubject = `Consulta de ${name} - ${subject}`;
                const emailBody = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
                const mailtoUrl = `mailto:${settings.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

                // Click handlers
                modal.querySelector("#sendWaBtn").addEventListener("click", () => {
                    window.open(waUrl, "_blank");
                    closeModal();
                });

                modal.querySelector("#sendEmailBtn").addEventListener("click", () => {
                    window.location.href = mailtoUrl;
                    closeModal();
                });

                const closeModal = () => {
                    modal.style.opacity = "0";
                    modal.children[0].style.transform = "scale(0.9)";
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                };

                modal.querySelector("#closeContactModalBtn").addEventListener("click", closeModal);

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
