import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { getParam } from "./utils.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}

async function init() {
  const productId = getParam("product");
  const product = await dataSource.findProductById(productId);

  if (!product) {
    document.querySelector(".product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("product-brand").textContent = product.Brand.Name;
  document.getElementById("product-name").textContent = product.NameWithoutBrand;
  const image = document.getElementById("product-image");
  image.src = product.Image;
  image.alt = product.Name;
  document.getElementById("product-price").textContent = `$${product.FinalPrice}`;
  document.getElementById("product-color").textContent =
    product.Colors?.[0]?.ColorName ?? "";
  document.getElementById("product-description").innerHTML =
    product.DescriptionHtmlSimple ?? "";
  document.getElementById("addToCart").dataset.id = product.Id;

  document.getElementById("addToCart").addEventListener("click", () => {
    addProductToCart(product);
  });
}

init();
