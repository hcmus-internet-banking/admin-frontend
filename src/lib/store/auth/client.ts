import { PUBLIC_API_URL } from '$env/static/public';
import axios from 'axios';

const client = axios.create({
	baseURL: PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	validateStatus: (status) => status < 500
});

export const initInterceptors = (accessToken: string) => {
	client.interceptors.request.use((config) => {
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	});
};

export default client;
