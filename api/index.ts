import { GetServerSidePropsContext } from 'next';
import { UserData } from "../pages";
import nookies from 'nookies'
import axios from 'axios';
import { UserApi } from './UserApi';

export const Api = (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const token = cookies?.token

  const instance = axios.create({
    baseURL: "http://localhost:3001",
  })
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return {
   ...UserApi(instance)
  }
};
