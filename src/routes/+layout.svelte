<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { authStore } from '$lib/store/auth/auth.store';
	import { browser } from '$app/environment';
	import { guardRoute, initInterceptors } from '$lib/utils/client';
	import { navigating } from '$app/stores';

	// Any of these will trigger once the first time
	initInterceptors();

	// First login and when logout => guard route
	authStore.user.subscribe((user) => {
		if (!browser) return;
		guardRoute();
	});

	// Guard route when navigating
	$: if ($navigating) guardRoute();

	// Globally listen to auth loading
	let isLoading = false;
	authStore.loading.subscribe((value) => {
		isLoading = value;
	});
</script>

<Toaster />

{#if isLoading}
	<div class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
		<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{/if}
<div class="min-h-screen py-4">
	<div class="mx-auto max-w-5xl p-4">
		<Header />
		<slot />
		<Footer />
	</div>
</div>
