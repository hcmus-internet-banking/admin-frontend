<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { authStore } from '$lib/store/auth/auth.store';
	import { browser } from '$app/environment';
	import { guardRoute } from '$lib/utils/client';
	import { navigating } from '$app/stores';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import Spinner from '$lib/components/spinner.svelte';
	import AppButton from '$lib/components/appButton.svelte';

	// First login and when logout => guard route
	authStore.user.subscribe((user) => {
		if (!browser) return;
		guardRoute();
	});

	// Init only once
	export const queryClient = new QueryClient();
	authStore.initialize();

	// Guard route when navigating
	$: if ($navigating) guardRoute();

	// Handle hydration loading
	$: isHydrated = authStore.isInit;
</script>

<QueryClientProvider client={queryClient}>
	<Toaster />
	{#if !$isHydrated}
		<Spinner />
	{:else}
		<div class="min-h-screen py-4 mb-52 bg-white">
			<div class="mx-auto max-w-5xl p-4">
				<Header />
				<div class="h-4" />
				<slot />
				<div class="mt-20" />
				<Footer />
			</div>
		</div>
	{/if}
</QueryClientProvider>
