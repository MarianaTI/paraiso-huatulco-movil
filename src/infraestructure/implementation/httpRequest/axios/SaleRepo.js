import ISaleRepo from "@/domain/repositories/ISaleRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

class SaleRepo extends ISaleRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/pwa/getVentas`;
        this.urlById = `${apiUrl}/pwa/success/A2R`;
        this.urlDisponibilidad = `${apiUrl}/servicios`;
    }

    async getAll(userId, page, search) {
        try {
            const response = await axios.get(`${this.url}?id_usuario=${userId}&page=${page}&limit=10&search=${search}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching las ventas:", error.message);
            throw error;
        }
    }

    async getById(id) {
        try {
            const response = await axios.get(`${this.urlById}${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching la venta: ", error.message);
            throw error;
        }
    }

    async getDisponibildadTour(fecha, destino) {
        try {
            const response = await axios.get(`${this.urlDisponibilidad}/getDisponibilidadTour?fecha=${fecha}&destino=${destino}`);
            return response.data;            
        } catch (error) {
            console.error("Error fetching los tours: ", error.message);
            throw error;
        }
    }

    async getDisponibildadTraslado(fecha, destino) {
        try {
            const response = await axios.get(`${this.urlDisponibilidad}/getDisponibilidadTraslado?fecha=${fecha}&destino=${destino}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching los tours: ", error.message);
            throw error;
        }
    }

    async getDisponibildadUnidad(fecha, destino) {
        try {
            const response = await axios.get(`${this.urlDisponibilidad}/getDisponibilidadUnidad?fecha=${fecha}&destino=${destino}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching las unidades: ", error.message);
            throw error;
        }
    }

    async getUnidades(fecha, destino) {
        try {
            const response = await axios.get(`${this.urlDisponibilidad}/getUnidades?fecha=${fecha}&destino=${destino}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching unidades: ", error.message);
            throw error;
        }
    }

    async getDisponibildadEmbarcaciones() {
        try {
            const response = await axios.get(`${this.urlDisponibilidad}/getDisponibilidadEmbarcaciones`);
            return response.data;
        } catch (error) {
            console.error("Error fetching embarcaciones: ", error.message);
            throw error;
        }
    }
}

export default SaleRepo;