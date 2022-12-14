<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import { trpc } from '$lib/trpc/client';
	import { navigating, page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { tryParseTRPCError } from '$lib/utils/trpc';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let formData = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		repassword: ''
	};
	let loading = false;

	onMount(() => {
		formData = {
			email: 'hopthucuatin@gmail.com',
			password: 'aimabiet',
			repassword: 'aimabiet',
			firstName: 'Hồ',
			lastName: 'Minh'
		};
	});

	async function handleSubmit() {
		loading = true;
		try {
			if (formData.password !== formData.repassword) {
				throw new Error('Password and repassword not match');
			}
			const res = await trpc($page).auth.register.mutate(formData);

			toast.success('Register success, navigate to login!');

			goto('/login');
		} catch (e: any) {
			const errors = await tryParseTRPCError(e);

			toast.error(errors.join('<br />'));
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto w-full mt-20">
	<form class="grid space-y-2" on:submit|preventDefault={handleSubmit}>
		<h1>Register</h1>
		<AppInput
			bind:value={formData.email}
			placeholder="Email"
			clearable
			autocomplete="email"
			isLoading={loading}
		/>
		<AppInput
			type="password"
			bind:value={formData.password}
			placeholder="Password"
			clearable
			hiddenable
			autocomplete="current-password"
			isLoading={loading}
		/>
		<AppInput
			type="password"
			bind:value={formData.repassword}
			placeholder="Repassword"
			clearable
			hiddenable
			autocomplete="current-password"
			isLoading={loading}
		/>
		<AppInput
			bind:value={formData.firstName}
			placeholder="First name"
			clearable
			autocomplete="current-password"
			isLoading={loading}
		/>
		<AppInput
			bind:value={formData.lastName}
			placeholder="Last name"
			clearable
			autocomplete="current-password"
			isLoading={loading}
		/>

		<p class="text-xs text-right text-gray-600">
			By clicking Register, you agree to our <a href="/terms">Terms</a> and that you have read our
			<a href="/privacy">Data Policy</a>, including our <a href="/cookie">Cookie Use</a>.
		</p>

		<div class="h-2" />
		<AppButton type="submit" size="md" isLoading={loading} disabled={loading}>Register</AppButton>
	</form>
</div>

<svelte:head>
	<title>Register</title>
</svelte:head>
