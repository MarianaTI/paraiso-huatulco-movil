import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetByIdSaleUseCase {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(id) {
        const getById = await this.saleRepo.getById(id);
        return getById;
    }
}

export default GetByIdSaleUseCase;