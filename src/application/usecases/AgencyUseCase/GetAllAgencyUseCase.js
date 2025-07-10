import IAgencyRepo from "@/domain/repositories/IAgencyRepo";

class GetAllAgencyUseCase {
    constructor(agencyRepo) {
        if (!agencyRepo instanceof IAgencyRepo) {
            throw new Error("AgencyRepo must be instance of IAgencyRepo");
        }
        this.agencyRepo = agencyRepo;
    }

    async run() {
        const getAgency = await this.agencyRepo.getAll();
        return getAgency;
    }
}

export default GetAllAgencyUseCase;