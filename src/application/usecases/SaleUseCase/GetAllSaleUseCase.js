import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetAllSaleUseCase {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(userId) {
        const getSale = await this.saleRepo.getAll(userId);
        return getSale;
    }
}

export default GetAllSaleUseCase;