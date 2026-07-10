document.addEventListener("DOMContentLoaded", () => {

    const plusButtons = document.querySelectorAll(".hg-plus");

    plusButtons.forEach(button => {

        button.addEventListener("click", () => {

            const popup = document.getElementById(
                "popup-" + button.dataset.popup
            );

            popup.classList.add("active");

        });

    });

    document.querySelectorAll(".hg-close").forEach(close => {

        close.addEventListener("click", () => {

            close.closest(".hg-popup")
                 .classList.remove("active");

        });

    });

    document.querySelectorAll(".hg-popup-overlay").forEach(overlay => {

        overlay.addEventListener("click", () => {

            overlay.parentElement
                   .classList.remove("active");

        });

    });

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
