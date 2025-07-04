import IUserRepo from "@/domain/repositories/IUserRepo";
import axios from "axios";
import { setUser } from "@/actions/userActions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL_LOGIN;
class UserRepo extends IUserRepo {
    constructor(dispatch) {
        super();
        this.dispatch = dispatch;
    }

    async signIn(formData) {
        try {
            const response = await axios.post(`${apiUrl}/pwaLogin`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            this.dispatch(setUser(response.data));
            return response.data;
        } catch (error) {
            console.error("Error signin in: ", error);
            throw error;
        }
    }
}

export default UserRepo;