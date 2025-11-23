// Product listing logic for shop.html

const MOCK_PRODUCTS = [
    { id: 1, name: "Urban Sneaker Pro", price: 120, currency: "R", category: "Sneakers", image: "../images/placeholder.svg" },
    { id: 2, name: "Essential Cotton Tee", price: 29, currency: "R", category: "Tops", image: "../images/placeholder.svg" },
    { id: 3, name: "Cozy Fleece Hoodie", price: 79, currency: "R", category: "Hoodies", image: "../images/placeholder.svg" },
    { id: 4, name: "Active Performance Shorts", price: 39, currency: "R", category: "Shorts", image: "../images/placeholder.svg" },
];

// Random generators for features, sizes, colors, description (like index.html modal)
const DESCRIPTIONS = [
    "Premium quality product for daily use.",
    "Limited edition, grab yours now!",
    "Soft and durable, perfect for any occasion.",
    "New arrival with unique comfort features.",
    "Versatile style that fits all wardrobes."
];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_COLORS = ["Black", "White", "Red", "Blue", "Green", "Grey"];
const FEATURES = ["Premium material", "Modern fit", "All-day comfort", "Machine washable", "Breathable fabric", "Limited edition design", "Easy care", "Classic style"];
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomSubarray(arr, min = 2, max = 4) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return arr.slice(0).sort(() => 0.5 - Math.random()).slice(0, count);
}
// Modal wiring
function openProductModal(productId) {
    const product = MOCK_PRODUCTS.find(p => String(p.id) === String(productId));
    if (!product) return;
    const desc = randomFrom(DESCRIPTIONS);
    const sizes = getRandomSubarray(ALL_SIZES, 3, 6);
    const colors = getRandomSubarray(ALL_COLORS, 2, 5);
    const features = getRandomSubarray(FEATURES, 3, 6);
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').alt = product.name;
    document.getElementById('modal-product-category').textContent = product.category;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = product.currency + product.price.toFixed(2);
    document.getElementById('modal-product-description').textContent = desc;
    document.getElementById('modal-sizes').innerHTML = sizes.map(size => `<button class="size-option">${size}</button>`).join('');
    document.getElementById('modal-colors').innerHTML = colors.map(color => `<span class="color-option" title="${color}" style="background-color:${color.toLowerCase()};display:inline-block;width:24px;height:24px;margin-right:5px;vertical-align:middle;cursor:pointer;border:2px solid #eee;border-radius:50%"></span>`).join('');
    document.getElementById('modal-features').innerHTML = features.map(f => `<li>${f}</li>`).join('');
    let selectedSize = null, selectedColorSpan = null, selectedColor = null;
    document.querySelectorAll('#modal-sizes .size-option').forEach(btn => {
        btn.onclick = function () {
            document.querySelectorAll('#modal-sizes .size-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected'); selectedSize = btn.textContent;
        };
    });
    document.querySelectorAll('#modal-colors .color-option').forEach((span, idx) => {
        span.onclick = function () {
            document.querySelectorAll('#modal-colors .color-option').forEach(b => b.style.borderColor = '#eee');
            span.style.borderColor = '#e10600'; selectedColorSpan = span; selectedColor = colors[idx];
        };
    });
    document.getElementById('modal-add-to-cart').onclick = function () {
        if (!selectedSize) { showModalNotification('Please select a size before adding to cart.', 'error'); return; }
        if (!selectedColor) { showModalNotification('Please select a colour before adding to cart.', 'error'); return; }
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ id: product.id, size: selectedSize, colour: selectedColor, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        showModalNotification(`${product.name} (${selectedSize}, ${selectedColor}) added to cart!`, 'success');
    };
    document.getElementById('product-details-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeProductModal() {
    document.getElementById('product-details-modal').style.display = 'none';
    document.body.style.overflow = '';
}
// Modal close on X or backdrop
if (document.querySelector('.modal-close'))
    document.querySelector('.modal-close').onclick = closeProductModal;
if (document.querySelector('.modal-backdrop'))
    document.querySelector('.modal-backdrop').onclick = closeProductModal;
// And ESC
window.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeProductModal();
});

function showModalNotification(msg, type = 'success') {
    let n = document.getElementById('modal-toast');
    if (!n) {
        n = document.createElement('div');
        n.id = 'modal-toast';
        n.style.position = 'absolute';
        n.style.top = '15px';
        n.style.left = '50%';
        n.style.transform = 'translateX(-50%)';
        n.style.background = type === 'success' ? '#28a745' : '#e10600';
        n.style.color = '#fff';
        n.style.padding = '0.75em 1.75em';
        n.style.borderRadius = '2em';
        n.style.boxShadow = '0 2px 18px rgba(0,0,0,0.08)';
        n.style.fontWeight = 'bold';
        n.style.zIndex = '9999';
        document.querySelector('.modal-content').appendChild(n);
    }
    n.style.background = type === 'success' ? '#28a745' : '#e10600';
    n.textContent = msg;
    n.style.display = 'block';
    setTimeout(()=>{ if(n) n.style.display='none'; },2000);
}

    function renderProductList() {
        const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = MOCK_PRODUCTS.map(product => `
        <div class="product-card fade-up" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="category">${product.category}</div>
                <h3>${product.name}</h3>
                <p class="price">${product.currency}${product.price.toFixed(2)}</p>
                <button class="btn-small view-details-btn" data-product-id="${product.id}">View Details</button>
            </div>
            </div>
        `).join('');
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            const productId = btn.getAttribute('data-product-id');
            openProductModal(productId);
        };
    });
}
document.addEventListener('DOMContentLoaded', function () {
    renderProductList();
});
