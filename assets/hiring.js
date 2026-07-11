document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-popup]');
    if (trigger) {
      const popup = document.getElementById(trigger.dataset.popup);
      if (popup) popup.classList.add("active");
      return;
    }

    const closeBtn = e.target.closest('.hg-close');
    const overlay = e.target.closest('.hg-popup-overlay');
    if (closeBtn || overlay) {
      const popup = e.target.closest('.hg-popup');
      if (popup) popup.classList.remove('active');
    }

    const colorBtn = e.target.closest('.hg-color-btn');
    if (colorBtn) {
      const group = colorBtn.closest('.hg-colors');
      group.querySelectorAll('.hg-color-btn').forEach(function (btn) {
        btn.classList.remove('is-selected');
      });
      colorBtn.classList.add('is-selected');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.hg-popup.is-open').forEach(function (popup) {
        popup.classList.remove('active');
      });
    }
  });
/**
 * Hiring Test — shared script
 * Banner: mobile hamburger menu open/close.
 * Grid + popup logic will be appended once hiring-grid.liquid is wired up.
 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.hb-menu-toggle').forEach(function (toggle) {
    var menu = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!menu) return;

    var closeBtn = menu.querySelector('.hb-mobile-menu__close');

    function openMenu() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // close on Escape for keyboard users
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  });
});
