import IBookingRepo from "@/domain/repositories/IBookingRepo";

class BookingUseCase {
    constructor(bookingRepo) {
        if (!(bookingRepo instanceof IBookingRepo)) {
            throw new Error("BookingRepo must be instance of IBookingRepo");
        }
        this.bookingRepo = bookingRepo;
    }

    async run(booking) {
        try {
            const bookingService = await this.bookingRepo.createBooking(booking);
            return bookingService;
        } catch (error) {
            console.log("Error booking:", error);
            throw error;
        }
    }
}

export default BookingUseCase;