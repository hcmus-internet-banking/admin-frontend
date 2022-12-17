<script lang="ts">
	import { authStore } from '$lib/store/auth/auth.store';
	import client from '$lib/utils/client';
	import { get } from 'svelte/store';

	let user = get(authStore.user);
</script>

<div class="grid space-y-4">
	<h1>Welcome to SvelteKit</h1>

	<p>
		{#await client.get('/api/employee')}
			<p>Waiting...</p>
		{:then res}
			<p>{JSON.stringify(res?.data)}</p>
		{:catch err}
			<p>{err.message}</p>
		{/await}
	</p>

	<!-- link to login page -->
	<span class="whitespace-pre-wrap overflow-scroll p-2 rounded bg-green-100 h-40">
		{JSON.stringify(user, null, 2)}
	</span>
</div>
