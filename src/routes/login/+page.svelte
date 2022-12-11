<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import { auth } from '$lib/store/auth/auth.store';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';

	// mock
	onMount(() => {
		email = 'hopthucuatin@gmail.com';
		password = 'Wlhibhlf1';

		console.log("I'm running babe");
	});

	function handleSubmit(e: Event) {
		auth.login({ email, password });
	}
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
		async
		defer
	></script>

	<script>
		const googleRecaptchaSiteKey = '6LdwoWQjAAAAADrkFj6tP9IEL_ynNxWH7DvJyKzO';

		// wait till id = recaptcha_button is available
		window.onloadCallback = function () {
			let maxTry = 3;
			let interval = setInterval(() => {
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
		<AppButton type="submit" btnSize="lg">Login</AppButton>
	</form>
</div>
<!-- On load callback -->
