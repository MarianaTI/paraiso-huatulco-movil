import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetDisponibildadUnidad {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(fecha, destino) {
        const getSale = await this.saleRepo.getDisponibildadUnidad(fecha, destino);
        return getSale;
    }
}

export default GetDisponibildadUnidad;