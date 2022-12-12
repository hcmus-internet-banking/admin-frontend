<script lang="ts">
	import { page } from '$app/stores';
	import AppButton from '$lib/components/appButton.svelte';
	import { trpc } from '$lib/trpc/client';

	let greeting = 'Hello!';
	let loading = false;

	const loadData = async () => {
		loading = true;
		greeting = await trpc($page).greeting.query();
		loading = false;
	};
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

<AppButton href="#load" role="button" aria-busy={loading} on:click={loadData}>Load</AppButton>
<p>{greeting}</p>
