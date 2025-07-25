import ITourRepo from "@/domain/repositories/ITourRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
class TourRepo extends ITourRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/pwa/getProductsMovil`;
        this.urlTop = `${apiUrl}/pwa/topProducts`;
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

    async getTopProducts() {
        try {
            const response = await axios.get(this.urlTop);
            return response.data;
        } catch (error) {
            console.error("Error fetching los tours:", error.message);
            throw error;
        }
    }
}

export default TourRepo;