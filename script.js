/**
 * Sheet details link and id and constants
 * https://docs.google.com/spreadsheets/d/1fGiZ2n270YbV4uKukVmQOr3JiMdfuBBYjhmdmP_ONwE/edit?gid=0#gid=0  and ID Menu
 */

// Replace with your actual Google Sheet ID and Tab Name
const SHEET_ID = '1fGiZ2n270YbV4uKukVmQOr3JiMdfuBBYjhmdmP_ONwE';
const SHEET_NAME = 'Menu';
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let menuData = [];
let cart = [];
let currentLang = 'EN'; // Default English  

/**
 * Event listner COMPLETE
 */
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.get-started-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log("Button clicked!"); // Check your browser console (F12) for this
            hideSplash();
        });
    }
});



// 1. Fetch and clear the menu data from sheet COMPLETE
/**
 * A fuction to load the the data from sheet to webpage
 */
async function loadMenu() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // OpenSheet uses the first row as keys automatically
        menuData = data.map(item => ({
            category: item.Category,
            nameHI: item.Dish_Name_HI,
            nameEN: item.Dish_Name_EN,
            descHI: item.Description_HI,
            descEN: item.Description_EN,
            price: item.Price,
            image: item.Image_File,
            status: item.Status
        }));

        renderCategories();
        renderMenu('All');
    } catch (error) {
        console.error("Error loading menu:", error);
        document.getElementById('menuGrid').innerHTML = "<p style='padding:20px;'>Failed to load menu. Please check your internet or Sheet settings.</p>";
    }
}
/**
 * A fuction to filter a menu on page by category, Availability, thali name update 
 */


// 2. Render UI COMPLETE
/**
 * A render function to make all menu appear on page physically and logically correct
 */
function renderMenu(categoryFilter, searchTerm = '') {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';

    const filtered = menuData.filter(item => {
        const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
        const nameMatch = item[`name${currentLang}`].toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && nameMatch;
    });
    filtered.forEach((item, index) => {
        const isAvailable = item.status === 'Available';
        const dishName = item[`name${currentLang}`];

        // Check Category (English) OR Hindi Name OR English Name for the keyword
        const isThali = item.category.includes("Thali") ||
            item.nameEN.includes("Thali") ||
            item.nameHI.includes("थाली");

        let thaliDetails = "";
        if (isThali) {
            // Use the English name (item.nameEN) for the logic check 
            // so it works even if the user is looking at the Hindi UI
            if (item.nameEN.includes("Main")) {
                thaliDetails = currentLang === 'EN'
                    ? "5 Roti, Sabji, Dal, Rice, Salad"
                    : "5 रोटी, सब्जी, दाल, चावल, सलाद";
            } else if (item.nameEN.includes("Special")) {
                thaliDetails = currentLang === 'EN'
                    ? "5 Roti, Mutter Paneer, Sabji, Dal, Jeera Rice, Salad, Papad, Achar, Dahi"
                    : "5 रोटी, मटर पनीर, सब्जी, दाल, जीरा राइस, सलाद, पापड़, अचार, दही";
            }
        }

        const card = document.createElement('div');
        card.className = `dish-card ${!isAvailable ? 'sold-out' : ''}`;

        card.innerHTML = `
        ${!isAvailable ? '<span class="sold-out-tag">Sold Out</span>' : ''}
        <img src="${item.image}" class="dish-img" loading="lazy">
        <div class="dish-info">
            <div>
                <h4 class="${isThali ? 'thali-title' : ''}">${dishName}</h4>
                ${thaliDetails ? `<p class="thali-desc">${thaliDetails}</p>` : ''}
            </div>
            <div class="price-row">
                <span class="price">₹${item.price}</span>
            
            ${isAvailable ? `<button class="add-btn" onclick="addToCart('${item.nameEN.replace(/'/g, "\\'")}')">ADD</button>` : ''}

                </div>
        </div>
    `;
        grid.appendChild(card);
    });
}

// Add this so the HTML onclick can find the function
window.setCategory = function (el, cat) {
    // 1. Remove 'active' class from all tabs
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));

    // 2. Add 'active' class to the clicked tab
    el.classList.add('active');

    // 3. Filter the menu
    renderMenu(cat);
};

function renderCategories() {
    const container = document.getElementById('categoryContainer');
    const cats = ['All', ...new Set(menuData.map(i => i.category))];
    container.innerHTML = cats.map(cat =>
        `<div class="category-tab" onclick="setCategory(this, '${cat}')">${cat}</div>`
    ).join('');
    container.firstChild.classList.add('active');
}


// 3. Logic Functions for cart  COMPLETE
// Updated addToCart using Name instead of Index
function addToCart(nameEN) {
    // 1. Find the actual dish from the master menuData using the name
    const dish = menuData.find(item => item.nameEN === nameEN);

    if (!dish) return; // Safety check

    // 2. Check if this dish is already in the cart
    const existingItem = cart.find(item => item.nameEN === nameEN);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        // 3. Add as a new entry
        cart.push({
            nameEN: dish.nameEN,
            nameHI: dish.nameHI,
            price: parseInt(dish.price),
            qty: 1
        });
    }
    updateCartBar();
}

// Fixed updateCartBar to handle numbers correctly
function updateCartBar() {
    const bar = document.getElementById('cartBar');
    if (!bar) return;

    if (cart.length > 0) {
        bar.classList.remove('hidden');
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        document.getElementById('cartCount').innerText = `${totalQty} Items`;
        document.getElementById('cartTotal').innerText = `₹${totalAmount}`;
    } else {
        bar.classList.add('hidden');
    }
}

// Updated renderCartReview for correct logic
function renderCartReview() {
    const listContainer = document.getElementById('cartReviewList');
    const modalTotalElem = document.getElementById('modalTotal');
    let total = 0;

    if (cart.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; padding:20px; color:#999;'>Your cart is empty</p>";
        modalTotalElem.innerText = "₹0";
        return;
    }

    listContainer.innerHTML = cart.map((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        return `
            <div class="review-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
                <div style="flex:1;">
                    <div style="font-weight:600;">${item[`name${currentLang}`]}</div>
                    <div style="font-size:0.8rem; color:#666;">₹${item.price}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)" >-</button>
                    <span style="font-weight:bold; width:20px; text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)" >+</button>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; cursor:pointer; font-size:1.5rem;">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    modalTotalElem.innerText = `₹${total}`;
}

window.changeQty = function (index, delta) {
    if (cart[index]) {
        if (cart[index].qty + delta >= 1) {
            cart[index].qty += delta;
        }
        updateCartBar();
        renderCartReview();
    }
};

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartBar();
    renderCartReview();
    if (cart.length === 0) closeOrderModal();
};



/**
 * Model editing functions and whatsapp message sender function  COMPLETE
 */

function openOrderModal() {
    if (cart.length === 0) return;
    document.getElementById('orderModal').style.display = 'flex';
    renderCartReview();
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function sendToWhatsApp() {

    const name = document.getElementById('custName').value;
    const hotel = document.getElementById('hotelName').value;
    const room = document.getElementById('roomNo').value;

    if (!name || !hotel || !room) {
        return alert("Please fill all details");
    }

    let orderText = `*New Order from ${name}*\n`;
    orderText += `Hotel: ${hotel} | Room: ${room}\n`;
    orderText += `------------------\n`;

    let total = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.qty;

        orderText += `• ${item[`name${currentLang}`]} x ${item.qty} = ₹${itemTotal}\n`;

        total += itemTotal;
    });

    orderText += `------------------\n`;
    orderText += `*Total: ₹${total}*\n\n`;
    orderText += `Please confirm the order and delivery charges over the phone within 10 minutes.\nकृपया 10 मिनट के भीतर फ़ोन पर ऑर्डर और डिलीवरी शुल्क की पुष्टि करें। \n +91 8233106918`;

    const encoded = encodeURIComponent(orderText);

    window.open(`https://wa.me/918233106918?text=${encoded}`);
}



// Helpers functions COMPLETE

/**
 * Function to hide the front page splash when <button onclick="hideSplash()" class="get-started-btn">Get Started</button> is clicked
 */
function hideSplash() {
    const splash = document.getElementById('splash');
    // This moves it up and then removes it from the view entirely
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
        splash.style.display = 'none';
    }, 500); // Wait for the fade-out to finish
}


/**
 * Function to filter the menu using a search bar work on input and enter at  <input type="text" id="searchInput" placeholder="Search for dishes..." onkeyup="filterMenu()">
 */
function filterMenu() {
    const term = document.getElementById('searchInput').value;
    renderMenu('All', term);
}

/**
 * Function to change the language of menu items call when <button id="langBtn" onclick="toggleLanguage()">हिन्दी</button>
 */
function toggleLanguage() {
    currentLang = currentLang === 'EN' ? 'HI' : 'EN';
    document.getElementById('langBtn').innerText = currentLang === 'EN' ? 'हिन्दी' : 'English';
    renderMenu('All');
}

/**
 * Calling a loadmenu() fuction to get the full menu on page open
 */
loadMenu();



