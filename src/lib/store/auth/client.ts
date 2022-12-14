import { PUBLIC_API_URL } from '$env/static/public';
import axios from 'axios';
import { get } from 'svelte/store';
import { authStore } from './auth.store';

const client = axios.create({
	baseURL: PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	validateStatus: (status) => status < 500
});

export const initInterceptors = () => {
	client.interceptors.request.use((config) => {
		const accessToken = get(authStore.user)?.tokens?.accessToken;

		if (config.headers && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	});
};

export default client;
