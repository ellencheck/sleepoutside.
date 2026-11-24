import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const cartList = document.querySelector(".product-list");

function getCartItems() {
  const items = getLocalStorage("so-cart");
  return Array.isArray(items) ? items : [];
}

function groupCartItems(items) {
  const groups = new Map();

  items.forEach((item) => {
    const key = String(item.Id ?? item.Name);
    if (!groups.has(key)) {
      groups.set(key, { item, quantity: 0 });
    }
    groups.get(key).quantity += 1;
  });

  return [...groups.entries()].map(([id, value]) => ({ id, ...value }));
}

function cartItemTemplate({ id, item, quantity }) {
  return `<li class="cart-card divider">
    <a href="../product_pages/?product=${id}" class="cart-card__image">
      <img
        src="${item.Images?.PrimaryMedium ?? item.Image ?? ""}"
        alt="${item.Name ?? "Product"}"
      />
    </a>
    <a href="../product_pages/?product=${id}">
      <h2 class="card__name">${item.NameWithoutBrand ?? item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
    <div class="cart-card__quantity quantity-control" aria-label="Quantity controls for ${item.Name}">
      <button type="button" class="quantity-control__button" data-action="decrease" data-id="${id}" aria-label="Decrease quantity of ${item.Name}" ${quantity === 1 ? "disabled" : ""}>−</button>
      <span class="quantity-control__value" aria-live="polite">${quantity}</span>
      <button type="button" class="quantity-control__button" data-action="increase" data-id="${id}" aria-label="Increase quantity of ${item.Name}">+</button>
    </div>
    <p class="cart-card__price">$${item.FinalPrice} each</p>
  </li>`;
}

function renderCartContents() {
  const groupedItems = groupCartItems(getCartItems());
  cartList.innerHTML = groupedItems.length
    ? groupedItems.map(cartItemTemplate).join("")
    : "<li class=\"empty-cart\">Your cart is empty.</li>";
}

function updateQuantity(productId, action) {
  const items = getCartItems();
  const index = items.findIndex((item) => String(item.Id ?? item.Name) === productId);

  if (index === -1) return;

  if (action === "increase") {
    items.push({ ...items[index] });
  } else if (action === "decrease") {
    const quantity = items.filter((item) => String(item.Id ?? item.Name) === productId).length;
    if (quantity <= 1) return;

    const removeIndex = items.findLastIndex
      ? items.findLastIndex((item) => String(item.Id ?? item.Name) === productId)
      : items.map((item) => String(item.Id ?? item.Name)).lastIndexOf(productId);
    items.splice(removeIndex, 1);
  }

  setLocalStorage("so-cart", items);
  renderCartContents();
}

cartList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  updateQuantity(button.dataset.id, button.dataset.action);
});

renderCartContents();
