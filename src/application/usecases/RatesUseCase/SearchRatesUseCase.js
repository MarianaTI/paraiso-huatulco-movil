import IRateRepo from "@/domain/repositories/IRateRepo";

class SearchRatesUseCase {
    constructor(rateRepo) {
        if(!(rateRepo instanceof IRateRepo)) {
            throw new Error("RateRepo must be instance of IRateRepo");
        }
        this.rateRepo = rateRepo;
    }
    async run(rates) {
        try {
            const searchRate = await this.rateRepo.createRate(rates);
            return searchRate;
        } catch (error) {
            console.log("Error searching rates:", error);
            throw error;
        }
    }
}

export default SearchRatesUseCase;