import IReportRepo from "@/domain/repositories/IReportRepo";

class GetAllReportUseCase {
    constructor(reportRepo) {
        if (!reportRepo instanceof IReportRepo) {
            throw new Error("ReportRepo must be instance of IReportRepo");
        }
        this.reportRepo =  reportRepo;
    }

    async run(start, end, idu, servicio, destino) {
        const getReport = await this.reportRepo.getAll(start, end, idu, servicio, destino);
        return getReport;
    }
}

export default GetAllReportUseCase;