import IHotelRepo from "@/domain/repositories/IHotelRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

class HotelRepo extends IHotelRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/pwa/getHoteles`;
    }

    async getAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error) {
            console.error("Error fetching los hoteles:", error.message);
            throw error;
        }
    }
}

export default HotelRepo;