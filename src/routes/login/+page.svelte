<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import { page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { tryParseTRPCError } from '$lib/utils/trpc';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/store/auth/auth.store';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	$: loading = authStore.loading || false;

	onMount(() => {
		email = 'employee1@yopmail.com';
		password = 'password';
	});

	async function handleSubmit() {
		const res = await authStore.login({ email, password });

		authStore.user.set(res?.data ?? null);
		goto('/');
	}
</script>

<div class="max-w-md mx-auto w-full mt-20">
	<form class="grid space-y-2" on:submit|preventDefault={handleSubmit}>
		<AppInput
			bind:value={email}
			placeholder="Email"
			clearable
			autocomplete="email"
			disabled={$loading}
			isLoading={$loading}
		/>
		<AppInput
			type="password"
			bind:value={password}
			placeholder="Password"
			clearable
			hiddenable
			autocomplete="current-password"
			isLoading={$loading}
			disabled={$loading}
		/>
		<!-- <div class="justify-center flex">
			<div id="recaptcha_button" />
		</div> -->
		<AppButton type="submit" size="md" isLoading={$loading} disabled={$loading}>Login</AppButton>
	</form>
</div>

<svelte:head>
	<title>Login</title>
	<script
		src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
		async
		defer
	></script>
	<script>
		// wait till id = recaptcha_button is available
		window.onloadCallback = function () {
			let maxTry = 3;
			const googleRecaptchaSiteKey = '6LdwoWQjAAAAADrkFj6tP9IEL_ynNxWH7DvJyKzO';

			const interval = setInterval(() => {
				if (!document.getElementById('recaptcha_button') || maxTry <= 0) {
					maxTry--;
					return;
				}

				grecaptcha.render('recaptcha_button', {
					sitekey: googleRecaptchaSiteKey
				});
				clearInterval(interval);
			}, 500);
		};
	</script>
</svelte:head>
