import { authStore } from '$lib/store/auth/auth.store';
import type { Router } from '$lib/trpc/router';
import { get } from 'svelte/store';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
	if (typeof window === 'undefined')
		return createTRPCClient<Router>({
			init,
			headers: {
				authorization: `Bearer ${get(authStore.tokens)?.accessToken}`
			}
		});
	if (!browserClient) browserClient = createTRPCClient<Router>();
	return browserClient;
}
