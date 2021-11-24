import axios from "../core/axios";
import { UserData } from "../pages";

export const UserApi = {
  getMe: async (): Promise<UserData> => {
    const { data } = await axios.get("/auth/me");
    return data;
  },
};
