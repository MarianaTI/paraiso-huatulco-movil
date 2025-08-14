import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetUnidades {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(fecha, destino) {
        const getSale = await this.saleRepo.getUnidades(fecha, destino);
        return getSale;
    }
}

export default GetUnidades;