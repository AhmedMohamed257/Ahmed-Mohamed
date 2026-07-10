document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("hgModal");

    const modalContent = modal.querySelector(".hg-modal-content");

    const close = modal.querySelector(".hg-close");



    document.querySelectorAll(".hg-plus").forEach(button => {

        button.addEventListener("click", async () => {

            const handle = button.dataset.product;

            const response = await fetch(`/products/${handle}.js`);

            const product = await response.json();

            let colors = "";

            let sizes = "";



            product.options.forEach(option=>{

                if(option.name.toLowerCase()=="color"){

                    option.values.forEach(value=>{

                        colors +=

                        `<button class="color-btn">${value}</button>`;

                    });

                }



                if(option.name.toLowerCase()=="size"){

                    option.values.forEach(value=>{

                        sizes +=

                        `<option>${value}</option>`;

                    });

                }

            });



            modalContent.innerHTML=`

                <div class="hg-product-top">

                    <img src="${product.images[0]}" />

                    <div>

                        <h3 class="hg-title">${product.title}</h3>

                        <div class="hg-price">

                        ${(product.price/100).toFixed(2)}€

                        </div>

                        <p class="hg-description">

                        ${product.description}

                        </p>

                    </div>

                </div>

                <div>

                    <label>Color</label>

                    <div class="colors">

                        ${colors}

                    </div>

                </div>

                <div>

                    <label>Size</label>

                    <select>

                        ${sizes}

                    </select>

                </div>

                <button

                    class="hg-add"

                    data-id="${product.variants[0].id}"

                >

                    ADD TO CART

                </button>

            `;

            modal.classList.add("active");



            document.querySelector(".hg-add").onclick = async function(){

                await fetch('/cart/add.js',{

                    method:'POST',

                    headers:{

                        'Content-Type':'application/json'

                    },

                    body:JSON.stringify({

                        id:this.dataset.id,

                        quantity:1

                    })

                });



                window.location='/cart';

            }

        });

    });



    close.onclick=()=>{

        modal.classList.remove("active");

    };



    modal.onclick=e=>{

        if(e.target===modal){

            modal.classList.remove("active");

        }

    };

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
