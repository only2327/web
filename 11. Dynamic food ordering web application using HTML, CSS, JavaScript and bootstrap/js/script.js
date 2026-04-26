// ============================================================
//  TastyBites - Food Ordering App  |  Pure Vanilla JavaScript
//  No jQuery, No CDN, No internet required
// ============================================================

// ---------- MENU DATA ----------
const menuItems = [
  { id: 1, name: "Classic French Fries",   category: "Snacks",    price: 120, image: "🍟", desc: "Crispy golden fries with sea salt." },
  { id: 2, name: "Loaded Nachos",          category: "Snacks",    price: 180, image: "🌮", desc: "Tortilla chips with melted cheese & jalapeños." },
  { id: 3, name: "Spicy Chicken Wings",    category: "Snacks",    price: 250, image: "🍗", desc: "Tossed in our signature hot sauce." },
  { id: 4, name: "Double Cheese Burger",   category: "Meals",     price: 199, image: "🍔", desc: "Juicy patty with double cheese & veggies." },
  { id: 5, name: "Margherita Pizza",       category: "Meals",     price: 299, image: "🍕", desc: "Fresh tomatoes, mozzarella & basil." },
  { id: 6, name: "Pasta Carbonara",        category: "Meals",     price: 249, image: "🍝", desc: "Creamy sauce with parmesan & herbs." },
  { id: 7, name: "Iced Cola",              category: "Beverages", price:  60, image: "🥤", desc: "Chilled cola served with ice cubes." },
  { id: 8, name: "Cold Brew Coffee",       category: "Beverages", price: 150, image: "☕", desc: "Slow-steeped smooth cold brew." },
  { id: 9, name: "Mango Smoothie",         category: "Beverages", price: 180, image: "🥭", desc: "Made with real fresh Indian mangoes." }
];

// ---------- CART STATE ----------
let cart = []; // Array of { id, name, price, image, quantity }

// ---------- ON PAGE LOAD ----------
document.addEventListener("DOMContentLoaded", function () {
  renderMenu(menuItems);
  renderCart();
});

// ---------- RENDER MENU ----------
function renderMenu(items) {
  var grid = document.getElementById("menu-grid");
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = '<p class="text-center text-muted w-100 py-5">No items found.</p>';
    return;
  }

  items.forEach(function (item) {
    var col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-4";
    col.innerHTML =
      '<div class="food-card">' +
        '<div class="food-emoji">' + item.image + '</div>' +
        '<div class="food-body">' +
          '<div class="food-name">' + item.name + '</div>' +
          '<div class="food-desc">' + item.desc + '</div>' +
          '<div class="food-footer">' +
            '<span class="food-price">&#8377;' + item.price.toFixed(2) + '</span>' +
            '<button class="add-btn" onclick="addToCart(' + item.id + ')">Add +</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    grid.appendChild(col);
  });
}

// ---------- FILTER BY CATEGORY ----------
function filterMenu(category, btn) {
  // Highlight active button
  var buttons = document.querySelectorAll(".cat-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  btn.classList.add("active");

  // Filter and render
  if (category === "All") {
    renderMenu(menuItems);
  } else {
    var filtered = menuItems.filter(function (item) {
      return item.category === category;
    });
    renderMenu(filtered);
  }
}

// ---------- ADD TO CART ----------
function addToCart(itemId) {
  var item = menuItems.find(function (i) { return i.id === itemId; });
  var existing = cart.find(function (c) { return c.id === itemId; });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
  }

  renderCart();
  showToast(item.name + " added to cart!");
}

// ---------- INCREASE QUANTITY ----------
function increaseQty(itemId) {
  var item = cart.find(function (c) { return c.id === itemId; });
  if (item) { item.quantity += 1; }
  renderCart();
}

// ---------- DECREASE QUANTITY / REMOVE ----------
function decreaseQty(itemId) {
  var idx = cart.findIndex(function (c) { return c.id === itemId; });
  if (idx === -1) return;

  if (cart[idx].quantity > 1) {
    cart[idx].quantity -= 1;
  } else {
    cart.splice(idx, 1); // Remove from cart entirely
  }
  renderCart();
}

// ---------- RENDER CART SIDEBAR ----------
function renderCart() {
  var list      = document.getElementById("cart-items-list");
  var totalEl   = document.getElementById("total-amount");
  var countEl   = document.getElementById("cart-count");

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML =
      '<div class="empty-cart-msg">' +
        '<div class="emoji">🛒</div>' +
        '<p>Your cart is empty.<br>Add some delicious food!</p>' +
      '</div>';
    countEl.style.display = "none";
    totalEl.textContent   = "₹0.00";
    return;
  }

  var grandTotal  = 0;
  var totalItems  = 0;

  cart.forEach(function (item) {
    var itemTotal = item.price * item.quantity;
    grandTotal   += itemTotal;
    totalItems   += item.quantity;

    var div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML =
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.image + ' ' + item.name + '</div>' +
        '<div class="cart-item-price">&#8377;' + item.price.toFixed(2) + ' each</div>' +
      '</div>' +
      '<div class="qty-controls">' +
        '<button class="qty-btn" onclick="decreaseQty(' + item.id + ')">&#8722;</button>' +
        '<span class="qty-num">' + item.quantity + '</span>' +
        '<button class="qty-btn" onclick="increaseQty(' + item.id + ')">&#43;</button>' +
      '</div>' +
      '<div class="cart-item-total">&#8377;' + itemTotal.toFixed(2) + '</div>';

    list.appendChild(div);
  });

  // Update total and badge
  totalEl.textContent = "₹" + grandTotal.toFixed(2);
  countEl.textContent = totalItems;
  countEl.style.display = "flex";
}

// ---------- OPEN / CLOSE CART ----------
function openCart() {
  document.getElementById("cart-sidebar").classList.add("open");
  document.getElementById("cart-overlay").style.display = "block";
}

function closeCart() {
  document.getElementById("cart-sidebar").classList.remove("open");
  document.getElementById("cart-overlay").style.display = "none";
}

// ---------- CHECKOUT ----------
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some items first.");
    return;
  }

  var total = document.getElementById("total-amount").textContent;
  alert("🎉 Order Placed Successfully!\n\nTotal Bill: " + total + "\n\nThank you for ordering from TastyBites!\nYour food will be ready soon.");

  cart = []; // Clear cart
  renderCart();
  closeCart();
}

// ---------- TOAST NOTIFICATION ----------
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = "✓ " + message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}
