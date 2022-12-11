import type { LoginResponse } from './auth.types';
import client from './client';
import { handleResponse, type BaseResponse } from './handleResponse';

export const getMyProfileAsync = async () => {
	const response = await client.get<BaseResponse<LoginResponse>>('/api/customer/my');

	console.log(response);

	return handleResponse(response);
};
