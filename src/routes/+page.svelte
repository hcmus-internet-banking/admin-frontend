<script lang="ts">
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import AdminManage from '$lib/components/home/adminManage.svelte';
	import Deposit from '$lib/components/home/deposit.svelte';
</script>

<svelte:head>
	<title>Admin Home - {PUBLIC_SITE_NAME}</title>
</svelte:head>

<div class="grid space-y-4">
	<h1 class="text-sm">Welcome to SvelteKit</h1>

	<AdminManage />
	<Deposit />
</div>
