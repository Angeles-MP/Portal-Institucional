/**
 * ==========================================================================
 * PORTAL INSTITUCIONAL - I.E. N° 80018 REPÚBLICA DE MÉXICO
 * Script de Interactividad, Accesibilidad, Animaciones y Navegación
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
     * 1. NAVEGACIÓN MÓVIL Y DRAWER CON ACCESIBILIDAD Y OVERLAY
     * -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navCloseBtn = document.querySelector('.nav-close-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMobileMenu = (forceState) => {
        if (!nav) return;
        const willOpen = typeof forceState === 'boolean' ? forceState : !nav.classList.contains('active');
        
        nav.classList.toggle('active', willOpen);
        if (navOverlay) {
            navOverlay.classList.toggle('active', willOpen);
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (willOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }

        // Prevenir scroll en body al abrir menú móvil
        document.body.style.overflow = willOpen ? 'hidden' : '';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu(false);
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });

    // Cerrar al hacer clic en cualquier enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
    });

    // Resetear menú móvil al redimensionar a pantalla de escritorio
    window.addEventListener('resize', () => {
        if (window.innerWidth > 868 && nav && nav.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });


    /* --------------------------------------------------------------------------
     * 2. ENCABEZADO FIJO Y BOTÓN 'VOLVER ARRIBA' AL HACER SCROLL
     * -------------------------------------------------------------------------- */
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top');

    const handleWindowScroll = () => {
        const scrollY = window.scrollY;

        // Header scrolled
        if (header) {
            if (scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visible
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll(); // Estado inicial

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* --------------------------------------------------------------------------
     * 3. REVELACIÓN DE ELEMENTOS POR INTERSECTION OBSERVER
     * -------------------------------------------------------------------------- */
    const animElements = document.querySelectorAll('.scroll-anim');

    if ('IntersectionObserver' in window && animElements.length > 0) {
        const animObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animElements.forEach(el => animObserver.observe(el));
    } else {
        // Fallback para navegadores antiguos
        animElements.forEach(el => el.classList.add('visible'));
    }


    /* --------------------------------------------------------------------------
     * 4. ANIMACIÓN DE CONTADORES NUMÉRICOS (Hero Stats)
     * -------------------------------------------------------------------------- */
    const statCards = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const animateNumberCounter = (el) => {
        const targetStr = el.getAttribute('data-target');
        if (!targetStr) return;

        const target = parseInt(targetStr, 10);
        const originalText = el.textContent.trim();
        const hasPlus = originalText.startsWith('+') || originalText.endsWith('+');
        const hasPercent = originalText.includes('%');

        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);

            let displayVal = currentVal.toLocaleString('es-PE');
            if (hasPlus) {
                displayVal = originalText.startsWith('+') ? `+${displayVal}` : `${displayVal}+`;
            }
            if (hasPercent) {
                displayVal = `${displayVal}%`;
            }

            el.textContent = displayVal;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = originalText;
            }
        };

        requestAnimationFrame(updateCount);
    };

    const statsGrid = document.querySelector('.hero-stats-grid');
    if (statsGrid && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statCards.forEach(card => animateNumberCounter(card));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        statsObserver.observe(statsGrid);
    }


    /* --------------------------------------------------------------------------
     * 5. DESPLAZAMIENTO SUAVE CON OFFSET PARA ENLACES ANCLA (#)
     * -------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    /* --------------------------------------------------------------------------
     * 6. ACORDEÓN INTERACTIVO PARA PREGUNTAS FRECUENTES (FAQ)
     * -------------------------------------------------------------------------- */
    const faqDetails = document.querySelectorAll('.faq-item');
    faqDetails.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                faqDetails.forEach(otherDetail => {
                    if (otherDetail !== detail && otherDetail.open) {
                        otherDetail.removeAttribute('open');
                    }
                });
            }
        });
    });


    /* --------------------------------------------------------------------------
     * 7. FILTRO Y LIGHTBOX DE GALERÍA DE FOTOS (Nosotros / Vida Escolar)
     * -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Filtrado por categoría
    if (filterBtns.length > 0 && galleryCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.92)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // Apertura del Lightbox
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const caption = card.querySelector('.gallery-overlay span') || card.querySelector('figcaption');
            if (img && lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Fotografía de la I.E. República de México';
                if (lightboxCaption && caption) {
                    lightboxCaption.textContent = caption.textContent;
                }
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });


    /* --------------------------------------------------------------------------
     * 8. PESTAÑAS INTERACTIVAS (TABS PARA NIVELES O CURRÍCULO)
     * -------------------------------------------------------------------------- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }


    /* --------------------------------------------------------------------------
     * 9. FORMULARIO INTERACTIVO DE CONTACTO INSTITUCIONAL - ENVÍO A WHATSAPP
     * -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formSuccessModal = document.getElementById('formSuccessModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

    // Función auxiliar para sanitizar cadenas en el resumen HTML
    const escapeHtml = (text) => {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('nombre');
            const telefonoInput = document.getElementById('telefono');
            const emailInput = document.getElementById('email');
            const nivelSelect = document.getElementById('nivel');
            const asuntoSelect = document.getElementById('asunto');
            const mensajeInput = document.getElementById('mensaje');
            const politicaInput = document.getElementById('politica');

            const nombre = nombreInput ? nombreInput.value.trim() : '';
            const telefono = telefonoInput ? telefonoInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const nivel = nivelSelect && nivelSelect.value ? nivelSelect.value : '';
            const asunto = asuntoSelect && asuntoSelect.value ? asuntoSelect.value : '';
            const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

            // Validaciones
            if (!nombre) {
                alert('Por favor ingresa tus nombres y apellidos completos.');
                if (nombreInput) nombreInput.focus();
                return;
            }

            if (!telefono) {
                alert('Por favor ingresa un número de celular o WhatsApp de contacto.');
                if (telefonoInput) telefonoInput.focus();
                return;
            }

            if (!email) {
                alert('Por favor ingresa tu correo electrónico.');
                if (emailInput) emailInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido (ej: usuario@correo.com).');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!nivel) {
                alert('Por favor selecciona el nivel educativo de interés (Primaria o Secundaria).');
                if (nivelSelect) nivelSelect.focus();
                return;
            }

            if (!asunto) {
                alert('Por favor selecciona el tipo de solicitud o trámite.');
                if (asuntoSelect) asuntoSelect.focus();
                return;
            }

            if (!mensaje) {
                alert('Por favor escribe tu consulta o requerimiento específico.');
                if (mensajeInput) mensajeInput.focus();
                return;
            }

            if (politicaInput && !politicaInput.checked) {
                alert('Debes aceptar la política de protección de datos para continuar.');
                politicaInput.focus();
                return;
            }

            // Construir el mensaje formateado para WhatsApp
            const textoWhatsApp = 
`🏛️ *SOLICITUD DE INFORMACIÓN - I.E. N° 80018 REPÚBLICA DE MÉXICO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Apoderado:* ${nombre}
📱 *Teléfono:* ${telefono}
📧 *Correo:* ${email}
🎓 *Nivel de Interés:* ${nivel}
📋 *Tipo de Solicitud:* ${asunto}
💬 *Mensaje / Consulta:*
${mensaje}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Enviado desde el Portal Institucional_`;

            // Número oficial de WhatsApp institucional (+51 970 240 371)
            const numeroWhatsApp = '51970240371';
            const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

            // Actualizar botón del modal
            if (modalWhatsappBtn) {
                modalWhatsappBtn.href = whatsappUrl;
            }

            // Actualizar resumen en el modal
            const modalDataSummary = document.getElementById('modalDataSummary');
            if (modalDataSummary) {
                modalDataSummary.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div><strong><i class="fa-solid fa-user" style="color:var(--secondary-color); width:18px;"></i> Apoderado:</strong> ${escapeHtml(nombre)}</div>
                        <div><strong><i class="fa-solid fa-phone" style="color:var(--secondary-color); width:18px;"></i> Teléfono:</strong> ${escapeHtml(telefono)}</div>
                        <div><strong><i class="fa-solid fa-envelope" style="color:var(--secondary-color); width:18px;"></i> Correo:</strong> ${escapeHtml(email)}</div>
                        <div><strong><i class="fa-solid fa-graduation-cap" style="color:var(--secondary-color); width:18px;"></i> Nivel:</strong> ${escapeHtml(nivel)}</div>
                        <div><strong><i class="fa-solid fa-tag" style="color:var(--secondary-color); width:18px;"></i> Asunto:</strong> ${escapeHtml(asunto)}</div>
                        <div><strong><i class="fa-solid fa-comment" style="color:var(--secondary-color); width:18px;"></i> Mensaje:</strong> <em>"${escapeHtml(mensaje)}"</em></div>
                    </div>
                `;
            }

            // Abrir WhatsApp de forma inmediata en una pestaña nueva
            window.open(whatsappUrl, '_blank');

            // Mostrar el modal de confirmación
            if (formSuccessModal) {
                formSuccessModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // Limpiar el formulario
            contactForm.reset();
        });
    }

    if (modalCloseBtn && formSuccessModal) {
        modalCloseBtn.addEventListener('click', () => {
            formSuccessModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (formSuccessModal) {
        formSuccessModal.addEventListener('click', (e) => {
            if (e.target === formSuccessModal) {
                formSuccessModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

});
