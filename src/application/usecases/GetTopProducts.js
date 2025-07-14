import ITourRepo from "@/domain/repositories/ITourRepo";

class GetTopProducts {
    constructor(tourRepo) {
        if (!tourRepo instanceof ITourRepo) {
            throw new Error("TourRepo must be instance of ITourRepo");
        }
        this.tourRepo = tourRepo;
    }

    async run() {
        const getTopProducts = await this.tourRepo.getTopProducts();
        return getTopProducts;
    }
}

export default GetTopProducts;