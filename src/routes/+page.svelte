<script lang="ts">
	import { authStore } from '$lib/store/auth/auth.store';
	import { get } from 'svelte/store';

	let user = get(authStore.user);
</script>

<h1>Welcome to SvelteKit</h1>

<!-- link to login page -->
<div class="grid">
	<a href="/login">Login</a>
	<a href="/admin">Admin</a>
	<span class="whitespace-pre-wrap overflow-scroll p-2 rounded bg-green-100">
		{JSON.stringify(user, null, 2)}
	</span>
</div>
