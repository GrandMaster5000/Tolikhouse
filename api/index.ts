import nookies from 'nookies'
import axios from 'axios';
import { UserApi } from './UserApi';
import { RoomApi } from './RoomApi';

type ApiReturnType = ReturnType<typeof UserApi> & ReturnType<typeof RoomApi>

export const Api = (ctx: any): ApiReturnType => {
  const cookies = nookies.get(ctx);
  const token = cookies?.token

  const instance = axios.create({
    baseURL: "http://localhost:3001",
  })
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return {
   ...UserApi(instance),
   ...RoomApi(instance)
  } as ApiReturnType
};
