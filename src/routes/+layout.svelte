<script lang="ts">
	export let data: ReturnType<typeof import('./+layout').load>;
	const { productName } = data;

	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	// import { initInterceptors } from '$lib/store/auth/client';
	// import { auth } from '$lib/store/auth/auth.store';
	import { Jumper } from 'svelte-loading-spinners';
	import { auth } from '$lib/store/auth/auth.store';
	import { browser } from '$app/environment';
	import { initInterceptors } from '$lib/store/auth/client';
	import { navigating } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	initInterceptors();

	auth.user.subscribe((user) => {
		if (!browser) return;

		guardRoute();
	});

	function guardRoute() {
		const route = get(navigating)?.to?.route.id;
		const authUser = get(auth.user);

		if (!authUser && !route?.match(/login|register/)) {
			toast.error("You're not logged in");
			return goto('/login');
		}
	}

	$: if ($navigating) guardRoute();

	// listen to auth loading
	let isLoading = false;
	auth.loading.subscribe((value) => {
		isLoading = value;
	});
</script>

<Toaster />

{#if isLoading}
	<div class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
		<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{/if}
<div class="min-h-screen bg-gray-100 py-4">
	<div class="mx-auto max-w-5xl p-4 rounded-md bg-gray-50">
		<Header />
		<slot />
		<Footer />
	</div>
</div>
