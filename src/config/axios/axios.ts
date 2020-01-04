import axios from 'axios';
import { HttpStatusEnum } from '../../shared';
import HttpException from '../../exceptions/httpException';

const onRejected = (err: any): any => {
  const errMessage = err.response
    ? err.response
    : 'Could not get any response from the main server';
  return Promise.reject(
    new HttpException(HttpStatusEnum.NOT_FOUND, errMessage)
  );
};

const axiosMainServer = axios.create({
  baseURL: 'http://mainServer/api/v1',
  validateStatus: status => {
    return (
      status >= HttpStatusEnum.SUCCESS && status <= HttpStatusEnum.BAD_REQUEST
    ); // default
  }
});
axiosMainServer.interceptors.response.use(res => res, onRejected);

export default axiosMainServer;
