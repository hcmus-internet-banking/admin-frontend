<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import { getMyProfileAsync } from '$lib/store/auth/api';
	import { auth } from '$lib/store/auth/auth.store';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-french-toast';

	let user = get(auth.user);

	function handleClick() {
		getMyProfileAsync().then((res) => {
			toast.success(JSON.stringify(res, null, 2), {});
		});
	}
</script>

<h1>Welcome to SvelteKit</h1>

<!-- link to login page -->
<div class="grid space-y-2">
	<a href="/login">Login</a>

	<AppButton on:click={handleClick}>Get my profile</AppButton>
	<AppButton on:click={auth.logout}>Logout</AppButton>

	<a href="/admin">Admin</a>
</div>

{JSON.stringify(user, null, 2)}
