# Shiv Restaurant – Dynamic Online Menu with WhatsApp Ordering 🚀

![Shiv Restaurant Banner](https://user-images.githubusercontent.com/your-banner-link.png)

**Shiv Restaurant** is a modern, dynamic restaurant menu website designed to streamline menu management and ordering. It features real-time menu updates powered by Google Sheets, category filters, a smart search bar, and direct WhatsApp ordering—all in an intuitive user interface.

---

## 🌟 Features

- **Live Menu Updates:** Instantly update menu items, prices, or categories via Google Sheets—no redeployment or manual code changes required!
- **WhatsApp Ordering:** Customers can build their orders and send them directly to your WhatsApp with a single click.
- **Search & Filter:** Quickly find dishes by keyword or browse by category.
- **Responsive Design:** Enjoy a seamless experience on mobiles, tablets, and desktops.
- **Easy Setup:** No backend server required—just Google Sheets and GitHub Pages!

---

## 🚦 Demo

> **[🔗 View Live Demo](https://akshayariya.github.io/Shiv-Restaurant/)**

---

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Google Sheets (provides live updates via published web API)
- **Integrations:** WhatsApp API for order messaging

---

## ⚡ How It Works

1. **Menu Data in Google Sheets**
    - Menu details (name, description, price, category, etc.) are managed in a Google Sheet.
    - Sheet is published to the web, acting as a lightweight backend.

2. **Dynamic Data Fetching**
    - JavaScript fetches and parses the menu data from the Google Sheet with AJAX.

3. **User Interaction**
    - Visitors browse, search, and filter menu items in real time.
    - Users add items to their order and confirm.

4. **WhatsApp Order Submission**
    - The entire order is assembled into a pre-filled WhatsApp message for fast, direct communication.

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/akshayariya/Shiv-Restaurant.git
cd Shiv-Restaurant
```

### 2. Configure Your Google Sheet

- Copy the sample Google Sheet structure from the `docs/` folder or [this example](https://docs.google.com/spreadsheets/...).
- Go to **File > Share > Publish to web** and publish your sheet as CSV or JSON.
- Copy the public link.

### 3. Set Your Sheet URL

- Open `js/config.js` (or the relevant config file).
- Replace the placeholder Sheet URL with your published Google Sheet link.

### 4. Run Locally

Open `index.html` in your browser, or deploy to GitHub Pages for instant hosting.

---

## 📲 WhatsApp Ordering

- Customers add desired dishes to their order.
- Clicking "Order on WhatsApp" opens WhatsApp with the complete order message ready for easy sending.
- No extra registration or login needed!

---

## 📁 Project Structure

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── config.js
├── assets/
└── docs/
```

---

## 🙏 Credits

- [Google Sheets](https://www.google.com/sheets/about/) for providing the live backend.
- [WhatsApp](https://www.whatsapp.com/) for deep-linking order integration.
- Open source contributors and the restaurant tech community.

---

## 📜 License

Proprietary. All Rights Reserved. You may not copy, modify, distribute, or use this software without explicit written permission from the owner.

---

> **Made with ❤️ by [Akshay Ariya](https://github.com/akshayariya)**
