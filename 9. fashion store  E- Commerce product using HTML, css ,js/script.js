// Product Data (Simulating a database)
// We use CSS colors as image placeholders since there is no internet to load external images.
const productsData = [
    { id: 1, name: "Classic White T-Shirt", price: 29.99, category: "men", color: "#34495e" },
    { id: 2, name: "Denim Jacket", price: 89.99, category: "men", color: "#2980b9" },
    { id: 3, name: "Floral Summer Dress", price: 59.99, category: "women", color: "#e74c3c" },
    { id: 4, name: "Leather Handbag", price: 120.00, category: "accessories", color: "#8e44ad" },
    { id: 5, name: "Slim Fit Jeans", price: 49.99, category: "men", color: "#2c3e50" },
    { id: 6, name: "Evening Gown", price: 199.99, category: "women", color: "#9b59b6" },
    { id: 7, name: "Polarized Sunglasses", price: 35.00, category: "accessories", color: "#16a085" },
    { id: 8, name: "Wool Overcoat", price: 149.99, category: "women", color: "#7f8c8d" },
    { id: 9, name: "Leather Belt", price: 25.00, category: "accessories", color: "#d35400" },
    { id: 10, name: "Running Sneakers", price: 85.00, category: "men", color: "#c0392b" }
];

let currentProducts = [...productsData];
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categoryTitle = document.getElementById('category-title');
const cartCount = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');

// Initialize the app
function init() {
    renderProducts(currentProducts);
    loadCart();
}

// Render products to the grid
function renderProducts(products) {
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No products found matching your criteria.</p>';
        return;
    }

    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        
        productEl.innerHTML = `
            <div class="product-image" style="background-color: ${product.color}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productEl);
    });
}

// Filter products by category
function filterProducts(category, event) {
    if(event) event.preventDefault();
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    if(event) {
        event.target.classList.add('active');
    }

    if (category === 'all') {
        currentProducts = [...productsData];
        categoryTitle.innerText = "Featured Products";
    } else {
        currentProducts = productsData.filter(p => p.category === category);
        categoryTitle.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Reset search
    searchInput.value = '';
    renderProducts(currentProducts);
}

// Search products by name
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = currentProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// CART FUNCTIONALITY

function toggleCart() {
    cartOverlay.classList.toggle('active');
}

function closeCart(e) {
    if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Quick animation for cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('fashion_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('fashion_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    // Update cart modal
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotalPrice.innerText = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        
        cartItemEl.innerHTML = `
            <div class="cart-item-img" style="background-color: ${item.color}">IMG</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    cartTotalPrice.innerText = '$' + total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    alert("Thank you for your purchase! This is a demo app, so no real transaction occurred.");
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Run init when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
