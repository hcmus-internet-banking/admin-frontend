import { get, writable } from 'svelte/store';
import type { Auth, LoginResponse } from './auth.types';
import client from './client';
import { handleResponse } from './handleResponse';
import type { BaseResponse } from './handleResponse';
import { goto } from '$app/navigation';

const createAuth = () => {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;

	const loading = writable(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const error = writable<BaseResponse<any> | null>(null);
	const user = writable<Auth['user']>(stored ? JSON.parse(stored) : null);

	async function login({ email, password }: { email: string; password: string }) {
		error.set(null);
		loading.set(true);

		try {
			const res = await client.post<BaseResponse<LoginResponse>>('/api/auth/login', {
				email,
				password,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				captchaValue: grecaptcha.getResponse()
			});

			const data = await handleResponse(res);

			user.set(data);

			// navigate to home page svelte
			goto('/');

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			error.set(err);
		} finally {
			loading.set(false);
		}
	}

	async function logout() {
		loading.set(true);

		try {
			await client.post('/api/auth/logout', {
				refreshToken: get(user)?.tokens?.refreshToken
			});

			user.set(null);

			// navigate to home page svelte
			goto('/');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			error.set(err);
		} finally {
			loading.set(false);
		}
	}

	async function updateAccessToken({ accessToken }: { accessToken: string }) {
		loading.set(true);

		try {
			const userValue = get(user);
			const newUser: LoginResponse = {
				...userValue,
				tokens: { ...userValue?.tokens, accessToken }
			};

			user.set(newUser);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			error.set(err);
		} finally {
			loading.set(false);
		}
	}

	return {
		loading,
		login,
		logout,
		updateAccessToken,
		error,
		user
	};
};

export const auth = createAuth();

// Connect to localStorage
auth.user.subscribe((user) => {
	if (user) {
		localStorage.setItem('user', JSON.stringify(user));
	} else {
		if (typeof localStorage !== 'undefined') localStorage.removeItem('user');
	}
});
