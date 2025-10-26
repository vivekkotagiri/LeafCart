/* ========== Basic state and selectors ========== */
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartList = document.querySelector('.cart-list');
const totalDisplay = document.querySelector('.total');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCountEl = document.getElementById('cartCount');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const goBackBtn = document.getElementById('goBackBtn');

const catBtns = document.querySelectorAll('.cat-btn');
const allProductsContainer = document.getElementById('allProducts');
const singleGrids = document.querySelectorAll('.single-grid');

const profileBtn = document.getElementById('profileBtn');
const profileSidebar = document.getElementById('profileSidebar');
const closeProfile = document.getElementById('closeProfile');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const saveProfile = document.getElementById('saveProfile');
const clearProfile = document.getElementById('clearProfile');

const navItems = document.querySelectorAll('.nav-item');
const dropdowns = document.querySelectorAll('.dropdown');

const allAddButtons = document.querySelectorAll('.card button');

let cart = JSON.parse(localStorage.getItem('leafcart_items') || '[]');
let addCount = JSON.parse(localStorage.getItem('leafcart_addCount') || '{}');

/* initialize addCount for existing product buttons */
allAddButtons.forEach(btn => {
    const name = btn.dataset.name;
    if (!addCount[name]) addCount[name] = 0;
});

/* update cart count badge */
function updateCartCount() {
    let totalItems = cart.reduce((s, i) => s + i.qty, 0);
    cartCountEl.textContent = totalItems;
    localStorage.setItem('leafcart_items', JSON.stringify(cart));
    localStorage.setItem('leafcart_addCount', JSON.stringify(addCount));
}
updateCartCount();

/* ========== Add to cart logic ========== */
allAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        addCount[name] = (addCount[name] || 0) + 1;

        const existing = cart.find(i => i.name === name);
        if (existing) existing.qty += 1;
        else cart.push({ name, price, qty: 1 });

        btn.textContent = `Add +${addCount[name]}`;
        updateCartCount();
    });
});

/* ========== Render cart ========== */
function renderCart() {
    cartList.innerHTML = '';
    if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty.</li>';
        totalDisplay.textContent = 'Total: ₹0';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>₹${item.price} each</small>
            </div>
            <div>
                <span class="qty">${item.qty}</span>
                <span class="cart-buttons">
                    <button class="dec">-</button>
                    <button class="inc">+</button>
                </span>
                <div style="margin-top:6px; text-align:right;">₹${item.price * item.qty}</div>
            </div>
        `;
        li.querySelector('.inc').addEventListener('click', () => {
            item.qty++; addCount[item.name] = (addCount[item.name] || 0) + 1;
            updateAddButtons(item.name);
            saveCart();
            renderCart();
            updateCartCount();
        });
        li.querySelector('.dec').addEventListener('click', () => {
            if (item.qty > 1) {
                item.qty--; addCount[item.name] = Math.max((addCount[item.name] || 1) - 1, 0);
            } else {
                cart = cart.filter(i => i.name !== item.name);
                addCount[item.name] = 0;
            }
            updateAddButtons(item.name);
            saveCart();
            renderCart();
            updateCartCount();
        });
        cartList.appendChild(li);
    });
    totalDisplay.textContent = `Total: ₹${total}`;
}

/* update card Add button text by name */
function updateAddButtons(name) {
    document.querySelectorAll(`.card button[data-name="${CSS.escape(name)}"]`).forEach(b => {
        const count = addCount[name] || 0;
        b.textContent = count > 0 ? `Add +${count}` : 'Add';
    });
}

/* save cart and counts */
function saveCart() {
    localStorage.setItem('leafcart_items', JSON.stringify(cart));
    localStorage.setItem('leafcart_addCount', JSON.stringify(addCount));
}

/* ========== Cart open/close & checkout ========== */
cartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
});
closeCart.addEventListener('click', () => cartModal.style.display = 'none');
cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.style.display = 'none'; });

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    let total = 0;
    cart.forEach(i => total += i.price * i.qty);
    localStorage.setItem('cartTotal', total);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('leafcart_last_payment', Date.now());
    window.location.href = 'payment.html';
});

/* ========== Search & Go Back ========== */
function showAllProducts() {
    allProductsContainer.style.display = 'block';
    singleGrids.forEach(g => g.style.display = 'none');
    catBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-btn[data-target="all"]').classList.add('active');
}

searchBtn.addEventListener('click', runSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

function runSearch() {
    const q = (searchInput.value || '').trim().toLowerCase();
    if (!q) return;
    let found = false;
    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('.name').textContent.toLowerCase();
        if (name.includes(q)) { card.style.display = 'block'; found = true; }
        else card.style.display = 'none';
    });
    document.querySelectorAll('.section-title').forEach(t => t.style.display = 'none');
    allProductsContainer.style.display = 'block';
    singleGrids.forEach(g => g.style.display = 'block');
    goBackBtn.style.display = found ? 'inline-block' : 'none';
    if (!found) alert('No products found!');
}

goBackBtn.addEventListener('click', () => {
    searchInput.value = '';
    document.querySelectorAll('.card').forEach(c => c.style.display = 'block');
    document.querySelectorAll('.section-title').forEach(t => t.style.display = 'block');
    showAllProducts();
    goBackBtn.style.display = 'none';
});

/* ========== Category Buttons ========== */
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (target === 'all') { showAllProducts(); window.scrollTo({ top: 220, behavior: 'smooth' }); return; }
        allProductsContainer.style.display = 'none';
        singleGrids.forEach(g => g.style.display = (g.id === target) ? 'block' : 'none');
        window.scrollTo({ top: 220, behavior: 'smooth' });
    });
});

/* ========== Profile Sidebar ========== */
profileBtn.addEventListener('click', () => {
    profileSidebar.classList.add('open');
    profileSidebar.setAttribute('aria-hidden', 'false');
    profileName.value = localStorage.getItem('leafcart_name') || '';
    profileEmail.value = localStorage.getItem('leafcart_email') || '';
});
closeProfile.addEventListener('click', () => {
    profileSidebar.classList.remove('open');
    profileSidebar.setAttribute('aria-hidden', 'true');
});
saveProfile.addEventListener('click', () => {
    localStorage.setItem('leafcart_name', profileName.value || 'Guest');
    localStorage.setItem('leafcart_email', profileEmail.value || 'guest@example.com');
    alert('Profile saved');
    profileSidebar.classList.remove('open');
});
clearProfile.addEventListener('click', () => {
    localStorage.removeItem('leafcart_name');
    localStorage.removeItem('leafcart_email');
    profileName.value = '';
    profileEmail.value = '';
    alert('Profile cleared');
});

/* ========== Nav dropdown toggles ========== */
navItems.forEach(item => {
    const targetEl = document.getElementById(item.dataset.target);
    item.addEventListener('click', e => {
        e.stopPropagation(); // prevent document click
        const isVisible = targetEl.style.display === 'block';
        dropdowns.forEach(d => d.style.display = 'none');
        targetEl.style.display = isVisible ? 'none' : 'block';
        profileSidebar.classList.remove('open');
    });
});

/* Close dropdowns if clicking outside header */
document.addEventListener('click', () => { dropdowns.forEach(d => d.style.display = 'none'); });

/* ========== Initialize UI ========== */
(function init() {
    Object.keys(addCount).forEach(name => {
        document.querySelectorAll(`.card button[data-name="${CSS.escape(name)}"]`).forEach(b => {
            b.textContent = addCount[name] && addCount[name] > 0 ? `Add +${addCount[name]}` : 'Add';
        });
    });
    updateCartCount();
    showAllProducts();
})();

/* Save state on unload */
window.addEventListener('beforeunload', () => {
    localStorage.setItem('leafcart_items', JSON.stringify(cart));
    localStorage.setItem('leafcart_addCount', JSON.stringify(addCount));
});

/* ESC closes overlays */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        cartModal.style.display = 'none';
        profileSidebar.classList.remove('open');
        dropdowns.forEach(d => d.style.display = 'none');
    }
});
