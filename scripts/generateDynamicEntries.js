const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");

async function getProductCodes() {
  const response = await axios.get(`https://admindemo.paraisohuatulco.com/admin/products/getProductsMovil`);
  const tours = response.data;

  const entries = tours.map((tour) => ({
    url: `/${tour.product_code}/`,
    revision: null,
  }));

  const outputPath = path.join(__dirname, "..", "data", "pwa-entries.json");
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`✅ Rutas dinámicas guardadas en ${outputPath}`);
}

getProductCodes().catch((err) => {
  console.error("❌ Error al obtener tours:", err.message);
});
