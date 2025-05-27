import ITourRepo from "@/domain/repositories/ITourRepo";
import axios from "axios";

const apiUrl = process.env.API_URL || 'https://admindemo.paraisohuatulco.com';

class TourRepo extends ITourRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/admin/products/getProductsMovil`;
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