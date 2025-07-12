import IClientRepo from "@/domain/repositories/IClientRepo";

class GetAllClientUseCase {
    constructor(clientRepo) {
        if (!clientRepo instanceof IClientRepo) {
            throw new Error("ClientRepo must be instance of IClientRepo");
        }
        this.clientRepo = clientRepo;
    }

    async run() {
        const getClient = await this.clientRepo.getAll();
        return getClient;
    }
}

export default GetAllClientUseCase;