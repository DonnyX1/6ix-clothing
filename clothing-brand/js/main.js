// 6IX Clothing Brand - Main JavaScript

// Floating Login Bubble Component
function initLoginBubble() {
    // Don't show on auth page
    if (window.location.pathname.includes('auth.html')) return;
    
    // Check if bubble already exists
    if (document.getElementById('login-bubble')) return;
    
    // Check if user is logged in (check both authService and localStorage)
    function checkIfLoggedIn() {
        if (typeof authService !== 'undefined' && authService && authService.isAuthenticated()) {
            return true;
        }
        if (localStorage.getItem('token')) {
            return true;
        }
        return false;
    }
    
    // Wait a bit for authService to load if it exists, then check
    setTimeout(() => {
        if (checkIfLoggedIn()) {
            const existingBubble = document.getElementById('login-bubble');
            if (existingBubble) existingBubble.remove();
            return;
        }
    
    // Create bubble element
    const bubble = document.createElement('div');
    bubble.id = 'login-bubble';
    bubble.innerHTML = `
        <div class="bubble-icon">👤</div>
        <div class="bubble-text">Login</div>
    `;
    
    // Add styles
    bubble.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: var(--accent-color);
        color: var(--light-text);
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 10px 25px rgba(225, 6, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: 'Helvetica Neue', 'Arial', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: bubbleFloat 3s ease-in-out infinite;
    `;
    
    // Add hover effect
    bubble.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 15px 35px rgba(225, 6, 0, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)';
    });
    
    bubble.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 25px rgba(225, 6, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // Add click handler
    bubble.addEventListener('click', function() {
        const currentPath = window.location.pathname;
        const authPath = currentPath.includes('html/') ? 'auth.html' : 'html/auth.html';
        window.location.href = authPath;
    });
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'token') {
            if (e.newValue) {
                // User logged in, hide bubble
                const bubble = document.getElementById('login-bubble');
                if (bubble) bubble.remove();
            } else {
                // User logged out, show bubble
                if (!document.getElementById('login-bubble')) {
                    initLoginBubble();
                }
            }
        }
    });
    
    // Add animation keyframes
    if (!document.getElementById('bubble-animations')) {
        const style = document.createElement('style');
        style.id = 'bubble-animations';
        style.textContent = `
            @keyframes bubbleFloat {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            @media (max-width: 768px) {
                #login-bubble {
                    bottom: 20px;
                    right: 20px;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.8rem;
                }
                #login-bubble .bubble-text {
                    display: none;
                }
                #login-bubble .bubble-icon {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
        // Append to body
        document.body.appendChild(bubble);
    }, 500);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login bubble
    initLoginBubble();
    // Load services
    if (typeof authService === 'undefined') {
        console.warn('Auth service not loaded');
    }
    if (typeof productService === 'undefined') {
        console.warn('Product service not loaded');
    }
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const megaToggles = document.querySelectorAll('.mega-toggle');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Mobile mega menu toggle
    if (megaToggles && megaToggles.length) {
        megaToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    e.preventDefault();
                    const li = this.closest('.has-mega');
                    const isOpen = li.classList.contains('open');
                    document.querySelectorAll('.nav-links .has-mega.open').forEach(openLi => openLi.classList.remove('open'));
                    li.classList.toggle('open', !isOpen);
                    this.setAttribute('aria-expanded', String(!isOpen));
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
    
    // FAQ accordions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
    
    // Product filtering
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    
    if (categorySelect) categorySelect.addEventListener('change', filterProducts);
    if (sortSelect) sortSelect.addEventListener('change', filterProducts);
    
    function filterProducts() {
        console.log('Filtering products...');
        const category = categorySelect ? categorySelect.value : 'all';
        const sortBy = sortSelect ? sortSelect.value : 'newest';
        console.log(`Category: ${category}, Sort by: ${sortBy}`);
    }

    // Preselect category from query param
    if (window.location.pathname.endsWith('shop.html')) {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        if (categoryParam && document.getElementById('category')) {
            const categorySelectEl = document.getElementById('category');
            const option = Array.from(categorySelectEl.options).find(opt => opt.value === categoryParam);
            if (option) {
                categorySelectEl.value = categoryParam;
                const changeEvent = new Event('change');
                categorySelectEl.dispatchEvent(changeEvent);
            }
        }
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!validateForm(contactForm)) {
                event.preventDefault();
                return;
            }
            console.log('Contact form submitted to tirosmashego@gmail.com');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            if (!validateEmail(emailInput.value)) {
                showNewsletterError('Please enter a valid email address');
                return;
            }
            const success = await subscribeToNewsletter(emailInput.value);
            if (success) {
                showNewsletterSuccess(newsletterForm, document.getElementById('newsletter-success'));
            } else {
                showNewsletterError('Subscription failed. Please try again.');
            }
        });
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function showNewsletterError(message) {
        const errorMessage = document.getElementById('newsletter-error');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }
    }
    function showNewsletterSuccess(form, successDiv) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
    }
    async function subscribeToNewsletter(email) {
        return new Promise(resolve => setTimeout(() => resolve(true), 1500));
    }

    function validateForm(form) {
        let valid = true;
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                valid = false;
                input.style.borderColor = '#ff3860';
            }
        });
        return valid;
    }
    // === QUICK VIEW ===
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.product-overlay .btn-small');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            if (this.textContent.trim() === 'Quick View') {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const product = products.find(p => p.name === productName);
                if (product) {
                    showQuickViewModal(product);
                }
            }
        });
    });
}

function showQuickViewModal(product) {
    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
        createQuickViewModal();
        modal = document.getElementById('quick-view-modal');
    }

    // Populate content
    document.getElementById('quick-view-img').src = product.image;
    document.getElementById('quick-view-img').alt = product.name;
    document.getElementById('quick-view-name').textContent = product.name;
    document.getElementById('quick-view-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quick-view-description').textContent = product.description || 'Premium quality product.';

    // Sizes
    const sizesContainer = document.getElementById('quick-view-sizes');
    sizesContainer.innerHTML = '';
    const sizes = product.availableSizes || ['One Size'];
    sizes.forEach(size => {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = 'size-btn';
        sizeBtn.textContent = size;
        sizeBtn.addEventListener('click', function() {
            document.querySelectorAll('#quick-view-sizes .size-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
        sizesContainer.appendChild(sizeBtn);
    });

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add-to-cart button
    document.getElementById('quick-add-to-cart-btn').onclick = function() {
        const activeSize = document.querySelector('#quick-view-sizes .size-btn.active');
        if (!activeSize) {
            alert('Please select a size before adding to cart.');
            return;
        }
        addToCart(product.id); // your existing function
        closeQuickViewModal();
        showNotification('Added to cart!', 'success');
    };

    // View details button
    document.getElementById('quick-view-details-btn').onclick = function() {
        closeQuickViewModal();
        window.location.href = `product.html?id=${product.id}`;
    };
}

function createQuickViewModal() {
    const modalHTML = `
        <div id="quick-view-modal" class="quick-view-modal" style="display: none;">
            <div class="quick-view-backdrop"></div>
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img id="quick-view-img" src="" alt="">
                    </div>
                    <div class="quick-view-details">
                        <h2 id="quick-view-name"></h2>
                        <p class="quick-view-price" id="quick-view-price"></p>
                        <p class="quick-view-description" id="quick-view-description"></p>

                        <div class="size-selection">
                            <h3>Select Size:</h3>
                            <div id="quick-view-sizes" class="size-options"></div>
                        </div>

                        <div class="quick-view-actions">
                            <button class="btn btn-accent" id="quick-add-to-cart-btn">Add to Cart</button>
                            <button class="btn btn-outline" id="quick-view-details-btn">View Full Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('quick-view-modal');
    modal.querySelector('.quick-view-close').addEventListener('click', closeQuickViewModal);
    modal.querySelector('.quick-view-backdrop').addEventListener('click', closeQuickViewModal);
}

function closeQuickViewModal() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

    
    
    initializeQuickView();
    
    function showQuickViewModal(product) {
        let modal = document.getElementById('quick-view-modal');
        if (!modal) {
            createQuickViewModal();
            modal = document.getElementById('quick-view-modal');
        }
        document.getElementById('quick-view-img').src = product.image;
        document.getElementById('quick-view-name').textContent = product.name;
        document.getElementById('quick-view-price').textContent = `$${product.price.toFixed(2)}`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function createQuickViewModal() {
        const modalHTML = `
            <div id="quick-view-modal" class="quick-view-modal" style="display: none;">
                <div class="quick-view-backdrop"></div>
                <div class="quick-view-content">
                    <button class="quick-view-close">&times;</button>
                    <div class="quick-view-body">
                        <div class="quick-view-image"><img id="quick-view-img" src="" alt=""></div>
                        <div class="quick-view-details">
                            <h2 id="quick-view-name"></h2>
                            <p id="quick-view-price"></p>
                            <button class="btn btn-accent" id="quick-add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('quick-view-modal');
        modal.querySelector('.quick-view-close').addEventListener('click', () => modal.style.display = 'none');
        modal.querySelector('.quick-view-backdrop').addEventListener('click', () => modal.style.display = 'none');
        modal.querySelector('#quick-add-to-cart-btn').addEventListener('click', function() {
            const productName = document.getElementById('quick-view-name').textContent;
            const product = products.find(p => p.name === productName);
            if (product) {
                addToCart(product.id);
                modal.style.display = 'none';
                showNotification('Added to cart!', 'success');
            }
        });
    }
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function renderProductList() {
        const list = document.getElementById('product-list');
        if (!list) return;
        productService.getAllProducts().then(products => {
            list.innerHTML = products.map(product => `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}" style="max-width:150px;">
                    <h2>${product.name}</h2>
                    <p>$${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}"><button>View Details</button></a>
                </div>
            `).join('');
        }).catch(error => {
            console.error('Error fetching products:', error);
            list.innerHTML = '<p>Failed to load products.</p>';
        });
    }
    function getProductById(id) {
        return productService.getProductById(id);
    }

    function renderProductDetails() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const product = getProductById(id);
        const details = document.getElementById('product-details');
        if (!product || !details) return;
        details.innerHTML = `
            <h1>${product.name}</h1>
            <p>$${product.price.toFixed(2)}</p>
            <button id="add-to-cart-btn" class="btn btn-accent">Add to Cart</button>
        `;
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.onclick = function() {
                addToCart(product.id);
                this.textContent = 'Added!';
                setTimeout(() => { this.textContent = 'Add to Cart'; }, 2000);
            };
        }
    }

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === productId);
        if (existing) existing.qty += 1;
        else cart.push({ id: productId, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // === UPDATED CART & CHECKOUT FUNCTIONS ===
    function renderCart() {
        const cartDiv = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartCount = document.getElementById('cart-count');
        const checkoutBtn = document.getElementById('checkout-btn');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        if (!cartDiv) return;
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            cartDiv.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            if (cartCount) cartCount.textContent = '0 items';
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (totalEl) totalEl.textContent = '$0.00';
            return;
        }
        cartDiv.style.display = 'block';
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'block';
        if (cartCount) cartCount.textContent = `${cart.length} item${cart.length > 1 ? 's' : ''}`;
        
        let total = 0;
        cartDiv.innerHTML = cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return '';
            const itemTotal = product.price * item.qty;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-image"><img src="${product.image}" alt="${product.name}"></div>
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        ${item.size ? `<p><small>Size: ${item.size}</small></p>` : ''}
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, '${item.size || ''}', ${item.qty - 1})">-</button>
                        <input type="number" min="1" value="${item.qty}" onchange="updateQuantity(${item.id}, '${item.size || ''}', this.value)">
                        <button onclick="updateQuantity(${item.id}, '${item.size || ''}', ${item.qty + 1})">+</button>
                        <button onclick="removeFromCart(${item.id}, '${item.size || ''}')">×</button>
                    </div>
                </div>
            `;
        }).join('');

        const tax = total * 0.08;
        const finalTotal = total + tax;
        if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
        if (window.location.pathname.endsWith('checkout.html')) renderCheckoutSummary();
    }

    function updateQuantity(productId, size, newQty) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.id === productId && (size ? i.size === size : !i.size));
        if (item) {
            item.qty = Math.max(1, Number(newQty));
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
    // Update removeFromCart to work globally and refresh UI
    function removeFromCart(productId, size) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(item => !(item.id === productId && (size ? item.size === size : !item.size)));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        if(window.location.pathname.endsWith('checkout.html')) renderCheckoutSummary();
    }
    function renderCheckoutSummary() {
        const checkoutItems = document.getElementById('checkout-items');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const taxEl = document.getElementById('checkout-tax');
        const totalEl = document.getElementById('checkout-total');
        
        if (!checkoutItems) return;
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        
        let total = 0;
        checkoutItems.innerHTML = cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return '';
            const itemTotal = product.price * item.qty;
            total += itemTotal;
            return `
                <div class="checkout-item">
                    <div class="checkout-item-image"><img src="${product.image}" alt="${product.name}"></div>
                    <div class="checkout-item-details"><strong>${product.name}</strong> (x${item.qty})</div>
                    <div class="checkout-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');
        const tax = total * 0.08;
        const finalTotal = total + tax;
        if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
    }

    if (window.location.pathname.endsWith('thank-you.html')) {
        localStorage.removeItem('cart');
    }
    if (window.location.pathname.endsWith('cart.html')) {
        document.addEventListener('DOMContentLoaded', renderCart);
    }
    if (window.location.pathname.endsWith('checkout.html')) {
        document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
    }

    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || 'null');
    if (adminProducts) window.products = adminProducts;
}); 

// === AUTH HELPERS (unchanged) ===
function getCurrentUser() {
    return authService ? authService.getUser() : null;
}
function logout() {
    if (authService) authService.logout();
    window.location.href = 'auth.html';
}
window.getCurrentUser = getCurrentUser;
window.logout = logout;

// ... (rest of your auth modal + navbar code unchanged)
