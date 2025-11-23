// Product API integration
const API_BASE_URL = 'http://localhost:5000/api';

class ProductService {
    constructor() {
        this.products = [];
    }

    async getAllProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            if (response.ok) {
                this.products = data;
                return { success: true, products: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async getFeaturedProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/featured`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, products: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async getProductById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, product: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async createProduct(productData) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, product: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async updateProduct(id, productData) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, product: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                },
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Local storage fallback for demo purposes
    getLocalProducts() {
        return [
            {
                id: 1,
                name: "6IX Classic Tee",
                price: 129.99,
                currency: "R",
                image: "../images/placeholder.svg",
                description: "A classic tee for everyday comfort.",
                category: "T-Shirts",
                featured: true
            },
            {
                id: 2,
                name: "6IX Hoodie",
                price: 249.99,
                currency: "R",
                image: "../images/placeholder.svg",
                description: "Stay warm and stylish with our signature hoodie.",
                category: "Hoodies",
                featured: true
            },
            {
                id: 3,
                name: "6IX Cap",
                price: 89.99,
                currency: "R",
                image: "../images/placeholder.svg",
                description: "Top off your look with a 6IX cap.",
                category: "Accessories",
                featured: true
            },
            {
                id: 4,
                name: "6IX Denim Jacket",
                price: 399.99,
                currency: "R",
                image: "../images/placeholder.svg",
                description: "Classic denim jacket with modern styling.",
                category: "Jackets",
                featured: true
            }
        ];
    }
}

// Global product service instance
window.productService = new ProductService(); 

document.addEventListener('DOMContentLoaded', function() {
    const MOCK_PRODUCTS = [
        { id: 1, name: "Urban Sneaker Pro", price: 120, currency: "R", category: "Sneakers", image: "../images/placeholder.svg" },
        { id: 2, name: "Essential Cotton Tee", price: 29, currency: "R", category: "Tops", image: "../images/placeholder.svg" },
        { id: 3, name: "Cozy Fleece Hoodie", price: 79, currency: "R", category: "Hoodies", image: "../images/placeholder.svg" },
        { id: 4, name: "Active Performance Shorts", price: 39, currency: "R", category: "Shorts", image: "../images/placeholder.svg" },
    ];
    const DESCRIPTIONS = [
        "Premium quality product for daily use.",
        "Limited edition, grab yours now!",
        "Soft and durable, perfect for any occasion.",
        "New arrival with unique comfort features.",
        "Versatile style that fits all wardrobes."
    ];
    const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "8", "9", "10", "11"];
    const ALL_COLORS = ["Black", "White", "Red", "Blue", "Green", "Grey"];
    const FEATURES = [
        "Premium material", "Modern fit", "All-day comfort", "Machine washable", "Breathable fabric",
        "Limited edition design", "Easy care", "Classic style"
    ];

    function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function getRandomSubarray(arr, min = 2, max = 4) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        return arr.slice(0).sort(() => 0.5 - Math.random()).slice(0, count);
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = MOCK_PRODUCTS.find(p => String(p.id) === String(productId));
    if (!product) return;
    // Product info
    const desc = randomFrom(DESCRIPTIONS);
    const sizes = getRandomSubarray(ALL_SIZES, 3, 6);
    const colors = getRandomSubarray(ALL_COLORS, 2, 5);
    const features = getRandomSubarray(FEATURES, 3, 6);
    // Fill elements
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').alt = product.name;
    document.getElementById('modal-product-category').textContent = product.category;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = product.currency + product.price.toFixed(2);
    document.getElementById('modal-product-description').textContent = desc;
    document.getElementById('modal-sizes').innerHTML = sizes.map(size => `<button class="size-option">${size}</button>`).join('');
    document.getElementById('modal-colors').innerHTML = colors.map(color => `<span class="color-option" title="${color}" style="background-color:${color.toLowerCase()};display:inline-block;width:24px;height:24px;margin-right:5px;vertical-align:middle;cursor:pointer;border:2px solid #eee;border-radius:50%"></span>`).join('');
    document.getElementById('modal-features').innerHTML = features.map(f => `<li>${f}</li>`).join('');
    // Picker logic
    let selectedSize = null; let selectedColorSpan = null; let selectedColor = null;
    document.querySelectorAll('#modal-sizes .size-option').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#modal-sizes .size-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.textContent;
        });
    });
    document.querySelectorAll('#modal-colors .color-option').forEach((span, idx) => {
        span.addEventListener('click', function () {
            document.querySelectorAll('#modal-colors .color-option').forEach(b => b.style.borderColor = '#eee');
            span.style.borderColor = '#e10600';
            selectedColorSpan = span; selectedColor = colors[idx];
        });
    });
    document.getElementById('modal-add-to-cart').onclick = function () {
        if (!selectedSize) { alert('Please select a size before adding to cart.'); return; }
        if (!selectedColor) { alert('Please select a colour before adding to cart.'); return; }
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ id: product.id, size: selectedSize, colour: selectedColor, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);
    };
}); 