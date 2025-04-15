import ITourRepo from "@/domain/repositories/ITourRepo";

class GetAllToursUseCase {
    constructor(tourRepo) {
        if (!tourRepo) {
            throw new Error("TourRepo must be instance of ITourRepo");
        }
        this.tourRepo = tourRepo;
    }

    async run() {
        const getTours = await this.tourRepo.getAll();
        return getTours;
    }
}

export default GetAllToursUseCase;