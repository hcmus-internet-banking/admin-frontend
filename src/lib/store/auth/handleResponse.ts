import type { AxiosResponse } from 'axios';
import { get } from 'svelte/store';
import { auth } from './auth.store';
import type { RefreshTokenResponse } from './auth.types';
import client from './client';

const isOk = (status: number) => status >= 200 && status < 300;

export interface BaseResponse<T> {
	error: { message: string } | null;
	data: T;
}

export const handleResponse = async <T>(response: AxiosResponse<BaseResponse<T>>) => {
	const status = response.status;
	const authState = get(auth.user);

	if (!isOk(status)) {
		switch (status) {
			case 401:
				try {
					//  if not login, then skip to the next case
					if (!authState) {
						break;
					}

					const refreshToken = authState.tokens?.refreshToken;

					if (!refreshToken) {
						throw new Error('Refresh token not found');
					}

					const {
						data: { accessToken }
					} = await refreshTokenAsync(refreshToken);

					if (!accessToken) {
						throw new Error('Fetching new access token failed');
					}

					auth.updateAccessToken({
						accessToken: accessToken
					});

					// reset
					// queryClient.refetchQueries();
				} catch (error) {
					auth.logout();
				}
				break;
			default:
				break;
		}

		const {
			data: { error }
		} = response;

		throw error;
	}

	return response.data.data;
};

export const handleRefreshTokenResponse = async <T>(response: AxiosResponse<BaseResponse<T>>) => {
	const status = response.status;

	if (!isOk(status)) {
		const {
			data: { error }
		} = response;

		throw error;
	}

	return response.data;
};

export const refreshTokenAsync = async (refreshToken: string) => {
	const response = await client.post<BaseResponse<RefreshTokenResponse>>(
		'/api/auth/refresh-token',
		{
			refreshToken
		}
	);

	return handleRefreshTokenResponse(response);
};
