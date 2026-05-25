/* ========================================
   RETRO STORE — JavaScript
   ======================================== */

(function () {
  'use strict';

  // ---- Estado del carrito ----
  let cartCount = 0;
  let alertTimeout = null;

  // ---- Referencias DOM ----
  const cartAlert = document.getElementById('cartAlert');
  const cartCounter = document.getElementById('cartCounter');
  const cartNum = document.getElementById('cartNum');

  // ---- Mostrar alerta ----
  function showAlert(name) {
    if (alertTimeout) clearTimeout(alertTimeout);

    cartAlert.textContent = '';

    const icon = document.createElement('span');
    icon.className = 'cart-alert-icon';
    icon.textContent = '✓';
    cartAlert.appendChild(icon);

    const text = document.createTextNode(
      name ? `"${name}" agregado al carrito` : 'Artículo agregado al carrito'
    );
    cartAlert.appendChild(text);

    cartAlert.classList.add('show');

    alertTimeout = setTimeout(() => {
      cartAlert.classList.remove('show');
    }, 2800);
  }

  // ---- Actualizar contador ----
  function updateCounter() {
    cartCount++;
    cartNum.textContent = cartCount;

    // Animación de "bump"
    cartNum.classList.remove('bump');
    void cartNum.offsetWidth; // reflow forzado para reiniciar animación
    cartNum.classList.add('bump');
  }

  // ---- Handler principal para "Agregar al carrito" ----
  function handleAddToCart(event) {
    const button = event.target.closest('.add-cart');
    if (!button) return;

    const name = button.dataset.name || null;
    showAlert(name);
    updateCounter();
  }

  // ---- Delegar clicks en toda la página ----
  document.addEventListener('click', handleAddToCart);

  // ---- Cerrar alert al hacer click en él ----
  cartAlert.addEventListener('click', () => {
    cartAlert.classList.remove('show');
    if (alertTimeout) clearTimeout(alertTimeout);
  });

  // ---- Inicializar Bootstrap modals correctamente ----
  // Asegura que los botones "Ver más" dentro de modals abiertos
  // no hereden eventos fantasma
  document.querySelectorAll('.modal').forEach((modalEl) => {
    modalEl.addEventListener('shown.bs.modal', () => {
      modalEl.querySelectorAll('.add-cart').forEach((btn) => {
        btn.setAttribute('tabindex', '0');
      });
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      // Restaurar foco al body para evitar bloqueos de Bootstrap
      document.body.focus();
    });
  });

  // ---- Hover en tarjeta: highlight suave ----
  document.querySelectorAll('.retro-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = '';
    });
  });

  // ---- Animación de entrada de cards al hacer scroll ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.retro-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.4s ease ${index * 0.06}s, transform 0.4s ease ${index * 0.06}s`;
    observer.observe(card);
  });

})();