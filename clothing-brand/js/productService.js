document.addEventListener('DOMContentLoaded', () => {
    console.log("🛍️ Product page loaded");
  
    // Grab product ID from the URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
  
    if (!productId) {
      document.getElementById('product-details').innerHTML = "<p>Product not found.</p>";
      return;
    }
  
    // Use local product data (same as shop.html)
    const products = [
        { 
            id: 1, 
            name: "Urban Sneaker Pro", 
            price: 120, 
            currency: "R",
            category: "sneakers", 
            image: "../images/placeholder.svg",
            description: "The Urban Sneaker Pro delivers ultimate comfort and style for the modern lifestyle. Featuring premium materials and innovative cushioning technology for all-day wear.",
            sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
            availableSizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11"]
        },
        { 
            id: 2, 
            name: "Essential Cotton Tee", 
            price: 29, 
            currency: "R",
            category: "tops", 
            image: "../images/placeholder.svg",
            description: "Our Essential Cotton Tee is crafted from premium organic cotton for unmatched comfort. Perfect for layering or wearing solo, this versatile piece is a wardrobe staple.",
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            availableSizes: ["S", "M", "L", "XL"]
        },
        { 
            id: 3, 
            name: "Cozy Fleece Hoodie", 
            price: 79, 
            currency: "R",
            category: "hoodies", 
            image: "../images/placeholder.svg",
            description: "The Cozy Fleece Hoodie combines comfort with contemporary style. Made with soft, premium fleece material that provides warmth and a relaxed fit for everyday wear.",
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            availableSizes: ["S", "M", "L", "XL", "XXL"]
        },
        { 
            id: 4, 
            name: "Active Performance Shorts", 
            price: 39, 
            currency: "R",
            category: "shorts", 
            image: "../images/placeholder.svg",
            description: "Designed for both performance and comfort, these Active Performance Shorts feature moisture-wicking fabric and a flexible design that moves with you during any activity.",
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            availableSizes: ["S", "M", "L", "XL"]
        }
    ];

    // Find the product by ID
    const product = products.find(p => p.id == productId);
  
    if (!product) {
      document.getElementById('product-details').innerHTML = `<p>Product not found.</p>`;
      return;
    }
  
    // Render product info
    document.getElementById('product-details').innerHTML = `
      <div class="product-details-container">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
          <h1>${product.name}</h1>
          <div class="product-price">${product.currency || 'R'}${product.price.toFixed(2)}</div>
          <div class="product-description">${product.description}</div>
          
          <div class="size-selection">
            <h3>Select Size:</h3>
            <div class="size-options">
              ${product.availableSizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}
            </div>
          </div>
          
          <div class="product-actions">
            <button id="add-to-cart-btn" class="btn btn-primary">Add to Cart</button>
            <button id="remove-from-cart-btn" class="btn btn-danger" style="display:none;">Remove from Cart</button>
            <a href="shop.html" class="btn btn-secondary">Continue Shopping</a>
          </div>
        </div>
      </div>
    `;
  
    // Add size selection functionality
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
  
    // Add to cart functionality
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-btn.active');
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize.textContent,
            image: product.image
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} (${selectedSize.textContent}) added to cart 🛒`);
    });

    // Handle remove from cart
    function updateRemoveButton() {
        const selectedSize = document.querySelector('.size-btn.active');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const found = cart.find(
            i => i.id == product.id && (!selectedSize || i.size == selectedSize.textContent)
        );
        document.getElementById('remove-from-cart-btn').style.display = found ? '' : 'none';
    }
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', updateRemoveButton);
    });
    updateRemoveButton();

    document.getElementById('remove-from-cart-btn').addEventListener('click', function() {
        const selectedSize = document.querySelector('.size-btn.active');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(i => !(i.id == product.id && (!selectedSize || i.size == selectedSize.textContent)));
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name}${selectedSize ? ' ('+selectedSize.textContent+') ' : ''}removed from cart`);
        updateRemoveButton();
    });

    // Replace modal or custom action with direct navigation:
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            const productId = card.getAttribute('data-product-id');
            window.location.href = `product.html?id=${productId}`;
        }
    });
  });

  const productService = {
    getAllProducts: async () => {
      try {
        const res = await fetch('/api/products'); // adjust URL to your backend route
        const data = await res.json();
        return { success: true, products: data };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
  
    getProductById: async (id) => {
      try {
        const res = await fetch(`/api/products/${id}`); // backend route for single product
        const data = await res.json();
        return { success: true, product: data };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }
  };
  
  