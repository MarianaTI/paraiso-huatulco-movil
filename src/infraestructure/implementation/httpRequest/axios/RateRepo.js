import IRateRepo from "@/domain/repositories/IRateRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
class RatesRepo extends IRateRepo {
  constructor() {
    super();
    this.url = "https://admindemo.paraisohuatulco.com/admin/rates/SearchRatesAPI";
  }

  async createRate(rates) {
    try {
      const formData = new FormData();
      formData.append("product_code", rates.product_code);
      formData.append("adults", rates.adults);
      formData.append("children", rates.children);
      formData.append("id_servicio", rates.id_servicio);
      formData.append("business_code", rates.business_code);
      formData.append("codigo_destino", rates.codigo_destino);
      formData.append("plataforma", rates.plataforma);
      formData.append("start_date", rates.start_date);
      formData.append("end_date", rates.end_date);
      formData.append("zona_hotel", rates.zona_hotel);
      formData.append("categoria_transporte", rates.categoria_transporte);
      formData.append("tipo_viaje", rates.tipo_viaje);
      const response = await axios.post(`${this.url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });
      return response.data;
      
    } catch (error) {
      console.error("Error fetching las tarifas:", error.message, error.code, error.response?.data);
      throw error;
    }
  }
}

export default RatesRepo;
