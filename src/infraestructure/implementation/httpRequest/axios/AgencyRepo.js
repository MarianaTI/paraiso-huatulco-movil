import IAgencyRepo from "@/domain/repositories/IAgencyRepo";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

class AgencyRepo extends IAgencyRepo {
  constructor() {
    super();
    this.url = `${apiUrl}/pwa/getDealers`;
  }

  async getAll() {
    try {
        const response = await axios.get(`${this.url}`);
        return response.data;
    } catch (error) {
      console.error("Error fetching las agencias:", error.message);
      throw error;
    }
  }
}

export default AgencyRepo;
