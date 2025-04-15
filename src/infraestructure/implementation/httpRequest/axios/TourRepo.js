import ITourRepo from "@/domain/repositories/ITourRepo";
import axios from "axios";

class TourRepo extends ITourRepo {
    constructor() {
        super();
        this.url = "https://admindemo.paraisohuatulco.com/admin/products/getProductsMovil?id_servicio=2";
    }

    async getAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error) {
            console.error("Error fetching los tours:", error.message);
            throw error;
        }
    }
}

export default TourRepo;