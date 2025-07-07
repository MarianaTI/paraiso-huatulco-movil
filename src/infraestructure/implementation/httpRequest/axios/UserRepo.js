import IUserRepo from "@/domain/repositories/IUserRepo";
import axios from "axios";

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
            return response.data;
        } catch (error) {
            console.error("Error signin in: ", error);
            throw error;
        }
    }
    async signOut() {
        try {
            await axios.post(`${apiUrl}/pwalogout`, null, {
                withCredentials: true
            });
            this.dispatch(setUser(null));
            return response.data;
        } catch (error) {
            console.error("Error signout in: ", error);
            throw error;
        }
    }
}

export default UserRepo;