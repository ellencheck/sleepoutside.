const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export default class ProductData {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${encodeURIComponent(category)}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
