import BookingUseCase from "@/application/usecases/BookingUseCase/BookingUseCase";
import BookingRepo from "@/infraestructure/implementation/httpRequest/axios/BookingRepo";

export const sendBooking = async (bookingData) => {
    const bookingRepo = new BookingRepo();
    const createBookingUseCase = new BookingUseCase(bookingRepo);
    return await createBookingUseCase.run(bookingData);
};