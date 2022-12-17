import { get, writable, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import { withLoading } from '$lib/core/withLoading';
import client, { guardRoute, initInterceptors } from '$lib/utils/client';
import { browser } from '$app/environment';
import { queryClient } from '$lib/queries';
import axios from 'axios';
import { PUBLIC_API_URL } from '$env/static/public';

export type BaseResponse<T> = {
	data: T;
};

export type BaseErrorResponse = {
	error: {
		message?: string;
	};
};

interface LoginResponse {
	employee: Employee;
	tokens: Tokens;
}

interface Tokens {
	refreshToken: string;
	accessToken: string;
}

interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	employeeType: string;
}

const createAuth = () => {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;

	const loading = writable(false);
	const error = writable<BaseErrorResponse | null>(null);
	const user = writable<LoginResponse | null>(stored ? JSON.parse(stored) : null);
	const tokens = derived(user, ($user) => $user?.tokens);
	const isInit = writable(false);

	async function updateAccessToken({ accessToken }: { accessToken: string }) {
		loading.set(true);

		try {
			user.update((user) => {
				if (user) {
					return {
						...user,
						tokens: { ...user.tokens, accessToken }
					};
				}
				return null;
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			error.set(err);
		} finally {
			loading.set(false);
		}
	}

	async function login({ email, password }: { email: string; password: string }) {
		return await withLoading({
			error,
			loading,
			fn: async () => {
				const { data } = await client.post<BaseResponse<LoginResponse>>(
					'/api/employee/auth/login',
					{
						email,
						password
					}
				);
				user.set(data.data);

				return data;
			}
		});
	}

	async function logout() {
		return await withLoading(
			{
				error,
				loading,
				fn: async () => {
					const res = await client.post('/api/employee/auth/logout', {
						refreshToken: get(user)?.tokens?.refreshToken
					});
					// navigate to home page svelte
					goto('/');

					return res.data;
				}
			},
			{
				onSettled: () => {
					// clear cache
					queryClient.clear();

					return user.set(null);
				}
			}
		);
	}

	async function refreshAccessToken() {
		try {
			const { data } = await axios.post<BaseResponse<{ accessToken: string }>>(
				`${PUBLIC_API_URL}/api/employee/auth/refresh`,
				{
					refreshToken: get(user)?.tokens?.refreshToken
				}
			);

			if (!data.data) {
				logout();
				return;
			}

			const { accessToken } = data.data;
			updateAccessToken({ accessToken });
		} catch (error) {
			logout();
		}
	}

	// Any of these will trigger once the first time
	async function initialize() {
		if (get(isInit)) return;
		if (!browser) return;

		initInterceptors();
		guardRoute();
		isInit.set(true);
	}

	return {
		initialize,
		isInit: derived(isInit, ($isInit) => $isInit),
		loading,
		login,
		logout,
		refreshAccessToken,
		tokens,
		error,
		user
	};
};

export const authStore = createAuth();
export type AuthStore = ReturnType<typeof createAuth>;

// Connect to localStorage
authStore.user.subscribe((user) => {
	if (user) {
		localStorage.setItem('user', JSON.stringify(user));
	} else {
		if (typeof localStorage !== 'undefined') localStorage.removeItem('user');
	}
});
