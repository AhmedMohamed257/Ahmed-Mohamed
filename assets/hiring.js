/**
 * Hiring Grid — quick view: variant selection + Add to Cart (Cart AJAX API)
 * Auto-add rule: if the added variant's options include Black + Medium,
 * also add the merchant-selected "auto add" product (e.g. Soft Winter Jacket).
 */
class ProductQuickview extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('[data-quickview-form]');
    this.variantInput = this.querySelector('[data-variant-id]');
    this.priceEl = this.closest('.hg-popup-box').querySelector('[data-price]');
    this.statusEl = this.querySelector('[data-status]');
    this.ctaBtn = this.querySelector('[data-add-to-cart]');
    this.ctaLabel = this.querySelector('[data-cta-label]');

    const json = this.querySelector('[data-product-json]');
    this.variants = json ? JSON.parse(json.textContent) : [];

    this.autoAddVariantId = this.dataset.sectionAutoAddVariant || null;

    this.selections = {};
    this.querySelectorAll('[data-option-position]').forEach((el) => {
      const pos = el.dataset.optionPosition;
      if (el.classList.contains('hg-select')) {
        this.selections[pos] = el.value;
      } else if (el.classList.contains('hg-colors')) {
        const selected = el.querySelector('.hg-color-btn.is-selected');
        if (selected) this.selections[pos] = selected.dataset.value;
      }
    });

    this.addEventListener('click', (e) => {
      const colorBtn = e.target.closest('.hg-color-btn');
      if (colorBtn) {
        e.preventDefault();
        const group = colorBtn.closest('.hg-colors');
        group.querySelectorAll('.hg-color-btn').forEach((b) => b.classList.remove('is-selected'));
        colorBtn.classList.add('is-selected');
        this.selections[colorBtn.dataset.optionPosition] = colorBtn.dataset.value;
        this.updateVariant();
      }
    });

    this.addEventListener('change', (e) => {
      if (e.target.classList.contains('hg-select')) {
        this.selections[e.target.dataset.optionPosition] = e.target.value;
        this.updateVariant();
      }
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addToCart();
    });

    this.updateVariant();
  }

  findMatchingVariant() {
    return this.variants.find((variant) => {
      const opts = [variant.option1, variant.option2, variant.option3];
      return Object.keys(this.selections).every((pos) => {
        const idx = parseInt(pos, 10) - 1;
        return opts[idx] === this.selections[pos];
      });
    });
  }

  updateVariant() {
    const match = this.findMatchingVariant();
    if (!match) {
      this.ctaBtn.disabled = true;
      this.statusEl.textContent = 'This combination is unavailable.';
      return;
    }
    this.ctaBtn.disabled = !match.available;
    this.variantInput.value = match.id;
    if (this.priceEl && match.price != null) {
      this.priceEl.textContent = this.formatMoney(match.price);
    }
    this.statusEl.textContent = match.available ? '' : 'Out of stock.';
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD' });
  }

  shouldAutoAdd(variant) {
    if (!variant) return false;
    const opts = [variant.option1, variant.option2, variant.option3]
      .filter(Boolean)
      .map((v) => v.toLowerCase());
    return opts.includes('black') && opts.includes('medium');
  }

  async addToCart() {
    const match = this.findMatchingVariant();
    if (!match || !match.available) return;

    this.ctaBtn.disabled = true;
    this.ctaLabel.textContent = 'Adding...';

    try {
      const items = [{ id: match.id, quantity: 1 }];

      if (this.shouldAutoAdd(match) && this.autoAddVariantId) {
        items.push({ id: this.autoAddVariantId, quantity: 1 });
      }

      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.description || 'Could not add to cart');
      }

      this.statusEl.textContent = items.length > 1
        ? 'Added to cart — plus a bonus item!'
        : 'Added to cart.';

      document.dispatchEvent(new CustomEvent('cart:updated'));

    } catch (err) {
      this.statusEl.textContent = err.message;
    } finally {
      this.ctaBtn.disabled = false;
      this.ctaLabel.textContent = 'ADD TO CART';
    }
  }
}

customElements.define('product-quickview', ProductQuickview);


/* ---------------------------------------------------------------
   Popup open/close + mobile menu (unchanged from before)
------------------------------------------------------------------ */
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
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  });
});

document.addEventListener('click', function (e) {
  const trigger = e.target.closest('[data-popup]');
  if (trigger) {
    const popup = document.getElementById(trigger.dataset.popup);
    if (popup) {
      popup.classList.add('is-open');
      document.documentElement.classList.add('hg-no-scroll');
      document.body.classList.add('hg-no-scroll');
    }
    return;
  }

  const closeBtn = e.target.closest('.hg-close');
  const overlay = e.target.closest('.hg-popup-overlay');
  if (closeBtn || overlay) {
    const popup = e.target.closest('.hg-popup');
    if (popup) popup.classList.remove('is-open');
    if (!document.querySelector('.hg-popup.is-open')) {
      document.documentElement.classList.remove('hg-no-scroll');
      document.body.classList.remove('hg-no-scroll');
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.hg-popup.is-open').forEach(function (popup) {
      popup.classList.remove('is-open');
    });
    document.documentElement.classList.remove('hg-no-scroll');
    document.body.classList.remove('hg-no-scroll');
  }
});