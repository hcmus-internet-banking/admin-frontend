import { goto } from '$app/navigation';
import { navigating } from '$app/stores';
import { PUBLIC_API_URL } from '$env/static/public';
import axios from 'axios';
import { get } from 'svelte/store';
import { authStore } from '../store/auth/auth.store';

const client = axios.create({
	baseURL: PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

export const initInterceptors = () => {
	client.interceptors.request.use((config) => {
		const accessToken = get(authStore.user)?.tokens?.accessToken;

		if (config.headers && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	});

	client.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response.status === 401) {
				await authStore.refreshAccessToken();

				const originalRequest = error.config;
				originalRequest.headers.Authorization = `Bearer ${
					get(authStore.user)?.tokens?.accessToken
				}`;

				return client(originalRequest);
			}

			return Promise.reject(error);
		}
	);
};

export function guardRoute() {
	const route = get(navigating)?.to?.route.id;
	const authUser = get(authStore.user);

	if (!authUser && !route?.match(/login|register/)) {
		return goto('/login');
	}
}

export default client;
