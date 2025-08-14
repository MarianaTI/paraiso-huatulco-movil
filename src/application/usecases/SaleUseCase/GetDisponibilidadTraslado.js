import ISaleRepo from "@/domain/repositories/ISaleRepo";

class GetDisponibildadTraslado {
    constructor(saleRepo) {
        if (!saleRepo instanceof ISaleRepo) {
            throw new Error("SaleRepo must be instance of ISaleRepo");
        }
        this.saleRepo = saleRepo;
    }

    async run(fecha, destino) {
        const getSale = await this.saleRepo.getDisponibildadTraslado(fecha, destino);
        return getSale;
    }
}

export default GetDisponibildadTraslado;