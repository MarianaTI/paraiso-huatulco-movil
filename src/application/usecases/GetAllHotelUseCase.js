import IHotelRepo from "@/domain/repositories/IHotelRepo";

class GetAllHotelUseCase {
    constructor(hotelRepo) {
        if (!hotelRepo instanceof IHotelRepo) {
            throw new Error("HotelRepo must be instance of IHotelRepo");
        }
        this.hotelRepo = hotelRepo;
    }

    async run() {
        const getHoteles = await this.hotelRepo.getAll();
        return getHoteles;
    }
}

export default GetAllHotelUseCase;