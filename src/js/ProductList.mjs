import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="${import.meta.env.BASE_URL}product_pages/?product=${product.Id}">
      <img src="${product.Images?.PrimaryMedium ?? ""}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand?.Name ?? ""}</h3>
      <h2 class="card__name">${product.NameWithoutBrand ?? product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

function categoryTitle(category) {
  const names = { tents: "Tents", backpacks: "Backpacks", "sleeping-bags": "Sleeping Bags", hammocks: "Hammocks" };
  return names[category] ?? category;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const heading = document.querySelector(".products h2");
    if (heading) heading.textContent = `Top Products: ${categoryTitle(this.category)}`;

    try {
      const products = await this.dataSource.getData(this.category);
      this.renderList(products ?? []);
    } catch (error) {
      console.error("Unable to load products:", error);
      this.listElement.innerHTML = "<li>Products could not be loaded. Please try again later.</li>";
    }
  }

  renderList(products) {
    renderListWithTemplate(productCardTemplate, this.listElement, products, "beforeend", true);
  }
}
