// Function to generate SVG placeholder images
function getSvgImage(title, bgColor) {
    const encodedTitle = encodeURIComponent(title);
    return `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22200%22%20height%3D%22250%22%20fill%3D%22%23${bgColor}%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23ffffff%22%20font-weight%3D%22bold%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214pt%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E${encodedTitle}%3C%2Ftext%3E%3C%2Fsvg%3E`;
}

// Book Data
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 15.99,
        image: getSvgImage("The Great Gatsby", "007bff")
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        category: "Fiction",
        price: 12.99,
        image: getSvgImage("1984", "17a2b8")
    },
    {
        id: 3,
        title: "Sapiens: Humankind",
        author: "Yuval Noah Harari",
        category: "Non-fiction",
        price: 22.50,
        image: getSvgImage("Sapiens", "28a745")
    },
    {
        id: 4,
        title: "Thinking, Fast & Slow",
        author: "Daniel Kahneman",
        category: "Non-fiction",
        price: 18.00,
        image: getSvgImage("Thinking, Fast", "20c997")
    },
    {
        id: 5,
        title: "Algorithms",
        author: "Thomas H. Cormen",
        category: "Academic",
        price: 85.00,
        image: getSvgImage("Algorithms", "dc3545")
    },
    {
        id: 6,
        title: "Calculus",
        author: "James Stewart",
        category: "Academic",
        price: 95.50,
        image: getSvgImage("Calculus", "fd7e14")
    }
];

let cart = [];

// DOM Elements
const bookList = document.getElementById('book-list');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderBooks('All');
});

// Render Books Function
function renderBooks(category) {
    bookList.innerHTML = '';
    const filteredBooks = category === 'All' ? books : books.filter(book => book.category === category);
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent === category || (category === 'All' && link.textContent === 'All Books')) {
            link.classList.add('active');
        }
    });

    if (filteredBooks.length === 0) {
        bookList.innerHTML = '<div class="col-12 text-center"><p>No books found in this category.</p></div>';
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card book-card h-100 shadow-sm border-0">
                    <img src="${book.image}" class="card-img-top book-img-top" alt="${book.title}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge badge-secondary mb-2 align-self-start">${book.category}</span>
                        <h5 class="card-title mb-1">${book.title}</h5>
                        <p class="book-author mb-2">${book.author}</p>
                        <p class="book-price mt-auto mb-3">$${book.price.toFixed(2)}</p>
                        <button class="btn btn-primary w-100 mt-auto" onclick="addToCart(${book.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookCard;
    });
}

// Filter Books
window.filterBooks = function(category) {
    renderBooks(category);
}

// Add to Cart Function
window.addToCart = function(bookId) {
    const book = books.find(b => b.id === bookId);
    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    updateCart();
    
    // Animate cart count
    cartCount.classList.add('animate-bounce');
    setTimeout(() => {
        cartCount.classList.remove('animate-bounce');
    }, 300);
}

// Remove from Cart
window.removeFromCart = function(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCart();
}

// Change Quantity
window.changeQuantity = function(bookId, change) {
    const item = cart.find(item => item.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            updateCart();
        }
    }
}

// Update Cart UI
function updateCart() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update Modal Content
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Your cart is empty.</td></tr>';
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.title}" class="cart-img d-none d-sm-block rounded" style="width: 40px; height: 50px; object-fit: cover;">
                            <div class="ml-2">
                                <h6 class="mb-0 text-truncate" style="max-width: 150px;" title="${item.title}">${item.title}</h6>
                            </div>
                        </div>
                    </td>
                    <td class="align-middle">$${item.price.toFixed(2)}</td>
                    <td class="align-middle">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-secondary" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <button type="button" class="btn btn-outline-secondary" disabled>${item.quantity}</button>
                            <button type="button" class="btn btn-outline-secondary" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    </td>
                    <td class="align-middle font-weight-bold">$${subtotal.toFixed(2)}</td>
                    <td class="align-middle">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            &times;
                        </button>
                    </td>
                </tr>
            `;
            cartItems.innerHTML += row;
        });
    }

    cartTotal.textContent = total.toFixed(2);
}

// Custom Modal Handling
window.openCartModal = function() {
    document.getElementById('cartModal').classList.add('show');
    document.getElementById('cartBackdrop').classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

window.closeCartModal = function() {
    document.getElementById('cartModal').classList.remove('show');
    document.getElementById('cartBackdrop').classList.remove('show');
    document.body.style.overflow = '';
}

// Mobile Nav Toggle
window.toggleNav = function() {
    const nav = document.getElementById('navbarNav');
    if(nav.classList.contains('show')){
        nav.classList.remove('show');
    } else {
        nav.classList.add('show');
    }
}

// Checkout
window.checkout = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your purchase!");
        cart = [];
        updateCart();
        closeCartModal();
    }
}
