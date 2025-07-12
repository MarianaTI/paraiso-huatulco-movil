import IClientRepo from "@/domain/repositories/IClientRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

class ClientRepo extends IClientRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/pwa/getClientes`;
    }

    async getAll() {
        try {
            const response = await axios.get(`${this.url}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching los clientes:", error.message);
            throw error;
        }
    }
}

export default ClientRepo;