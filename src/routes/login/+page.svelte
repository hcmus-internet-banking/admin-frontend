<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { tryParseTRPCError } from '$lib/utils/trpc';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';

	onMount(() => {
		email = 'hopthucuatin@gmail.com';
		password = 'aimabiet';
	});

	async function handleSubmit() {
		// auth.login({ email, password });
		try {
			const res = await trpc($page).auth.login.mutate({ email, password });

			toast.success(JSON.stringify(res, null, 2));
		} catch (e: any) {
			const errors = await tryParseTRPCError(e);

			toast.error(errors.join('<br />'));
		}
	}
</script>

<div class="max-w-[18rem] mx-auto mt-20">
	<form class="grid space-y-2" on:submit|preventDefault={handleSubmit}>
		<AppInput bind:value={email} placeholder="Email" clearable autocomplete="email" />
		<AppInput
			type="password"
			bind:value={password}
			placeholder="Password"
			clearable
			hiddenable
			autocomplete="current-password"
		/>
		<div id="recaptcha_button" />
		<AppButton type="submit" btnSize="md">Login</AppButton>
		<a href="/register">Register</a>
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
