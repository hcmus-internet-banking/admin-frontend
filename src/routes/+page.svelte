<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import { getMyProfileAsync } from '$lib/store/auth/api';
	import { auth } from '$lib/store/auth/auth.store';
	import type { LoginResponse } from '$lib/store/auth/auth.types';
	import { toast } from '@zerodevx/svelte-toast';

	let user: LoginResponse | null | undefined;

	auth.user.subscribe((value) => {
		user = value;
	});

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
<button on:click={handleClick}> Get my profile </button>

{JSON.stringify(user, null, 2)}
