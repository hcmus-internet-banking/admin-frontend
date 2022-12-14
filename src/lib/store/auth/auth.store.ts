import { get, writable, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import axios from 'axios';
import type { RouterOutputs } from '$lib/trpc/router';

const createAuth = () => {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;

	const loading = writable(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const error = writable<any | null>(null);
	const user = writable<RouterOutputs['auth']['login'] | null>(stored ? JSON.parse(stored) : null);
	const tokens = derived(user, ($user) => $user?.tokens);

	async function logout() {
		loading.set(true);

		try {
			await axios.post('/api/auth/logout', {
				refreshToken: get(user)?.tokens?.refreshToken
			});

			// navigate to home page svelte
			goto('/');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			error.set(err);
		} finally {
			loading.set(false);
			user.set(null);
		}
	}

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

	return {
		loading,
		logout,
		updateAccessToken,
		tokens,
		error,
		user
	};
};

export const authStore = createAuth();

// Connect to localStorage
authStore.user.subscribe((user) => {
	if (user) {
		localStorage.setItem('user', JSON.stringify(user));
	} else {
		if (typeof localStorage !== 'undefined') localStorage.removeItem('user');
	}
});
