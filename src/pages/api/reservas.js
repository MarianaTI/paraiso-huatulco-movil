import BookingRepo from "@/infraestructure/implementation/httpRequest/axios/BookingRepo";
import BookingUseCase from "@/application/usecases/BookingUseCase/BookingUseCase";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const bookingData = req.body;
        console.log("api/reserva.js", bookingData);
        
        const bookingRepo = new BookingRepo();
        const createBookingUseCase = new BookingUseCase(bookingRepo);
        const result = await createBookingUseCase.run(bookingData);

        return res.status(200).json({success: true, data: result});
    } catch (error) {
        console.error("Error en /api/reservas:", error);
        return res.status(500).json({ error: "Error al crear reserva" });
    }
}