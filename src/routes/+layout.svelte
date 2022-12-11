<script lang="ts">
	import '../app.postcss';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { initInterceptors } from '$lib/store/auth/client';
	import { auth } from '$lib/store/auth/auth.store';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { Jumper } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { LoginResponse } from '$lib/store/auth/auth.types';
	import { get } from 'svelte/store';

	auth.user.subscribe((user) => {
		if (!browser) return;
		const tokens = user?.tokens;

		if (tokens?.accessToken) initInterceptors(tokens?.accessToken);

		guardRoute(user);
	});

	function guardRoute(user: LoginResponse | null | undefined) {
		const route = $navigating?.to?.route.id;

		const authUser = get(auth.user);

		if (authUser && route?.match(/login|register/)) {
			return goto('/');
		}

		if (!authUser) {
			return goto('/login');
		}
	}

	$: if ($navigating) guardRoute(get(auth.user));

	// listen to auth loading
	let isLoading = false;

	auth.loading.subscribe((value) => {
		isLoading = value;
	});
</script>

<SvelteToast />

{#if isLoading}
	<div class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
		<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{/if}
<div class="mx-auto max-w-5xl px-4">
	<Header />
	<slot />
	<Footer />
</div>
