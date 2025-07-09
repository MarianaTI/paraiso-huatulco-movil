import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetAllSaleUseCase {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(userId, page) {
        const getSale = await this.saleRepo.getAll(userId, page);
        return getSale;
    }
}

export default GetAllSaleUseCase;