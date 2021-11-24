import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { UserApi } from "../api/UserApi";
import { UserData } from "../pages";

export const checkAuth = async (
  ctx: GetServerSidePropsContext
): Promise<UserData | null> => {
  try {
    const cookie = nookies.get(ctx);
    if (cookie.token) {
    }

    return await UserApi.getMe();
  } catch (e) {
    return null;
  }
};
