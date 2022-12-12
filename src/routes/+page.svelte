<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import { getMyProfileAsync } from '$lib/store/auth/api';
	import { auth } from '$lib/store/auth/auth.store';
	import { toast } from '@zerodevx/svelte-toast';
	import { get } from 'svelte/store';

	let user = get(auth.user);

	function handleClick() {
		console.log('get my profile');

		getMyProfileAsync().then((res) => {
			toast.push(JSON.stringify(res, null, 2), {});
		});
	}
</script>

<h1>Welcome to SvelteKit</h1>

<!-- link to login page -->
<a href="/login">Login</a>

<AppButton on:click={handleClick}>Get my profile</AppButton>
<AppButton on:click={auth.logout}>Logout</AppButton>

{JSON.stringify(user, null, 2)}
