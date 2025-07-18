import IReportRepo from "@/domain/repositories/IReportRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

class ReportRepo extends IReportRepo {
    constructor() {
        super();
        this.url = `${apiUrl}/pwa`;
    }

    async getAll(start, end, idu, servicio) {
        try {
            const response = await axios.get(`${this.url}/reporteVentasDiaAgente?start=${start}&end=${end}&servicio=${servicio}&idu=${idu}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching los reportes: ", error.message);
            throw error;
        }
    }
}

export default ReportRepo;