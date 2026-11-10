import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

if (category) {
  const productList = new ProductList(category, dataSource, listElement);
  productList.init();
} else {
  listElement.innerHTML = "<li>Please choose a product category.</li>";
}
