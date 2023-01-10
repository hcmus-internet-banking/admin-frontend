<script lang="ts">
	import { z } from 'zod';
	import { validator } from '@felte/validator-zod';
	import AppButton from '../appButton.svelte';
	import AppInput from '../appInput.svelte';
	import { Checkmark } from 'svelte-ionicons';
	//@ts-ignore

	export const registerSchema = z
		.object({
			email: z.string().email(),
			password: z.string().min(8),
			repassword: z.string().min(8),
			firstName: z.string().min(2),
			lastName: z.string().min(2)
		})
		.superRefine(({ repassword, password }, ctx) => {
			if (repassword !== password) {
				ctx.addIssue({
					path: ['repassword'],
					code: 'custom',
					message: 'The passwords did not match'
				});
			}
		});

	import { createForm } from 'felte';
	import client from '$lib/utils/client';
	import toast from 'svelte-french-toast';

	let showModal = false;

	const { form, errors, data } = createForm<z.infer<typeof registerSchema>>({
		onSubmit: async (values, { reset }) => {
			try {
				toast.promise(
					client.post('/api/auth/register', {
						...values
					}),
					{
						loading: 'Registering...',
						//@ts-ignore
						success: (data) => {
							showModal = true;
							reset();

							return `Account: ${data.data.data.email} created`;
						},
						//@ts-ignore
						error: (e) => {
							console.log(e);
							return (
								e?.response?.data?.error?.message ||
								e?.message ||
								e?.error?.message ||
								'Something went wrong'
							);
						}
					}
				);
			} catch (e) {
				console.log(e);
				return;
			}
		},
		extend: validator({ schema: registerSchema })
	});
</script>

<section class="rounded-md border border-green-300 [&>*]:p-4">
	<h2 class="bg-green-200">Register</h2>
	<form class="space-y-2" use:form>
		<AppInput
			placeholder="Email"
			name="email"
			error={$errors.email?.join(', ')}
			type="email"
			required
		/>
		<AppInput
			placeholder="Password"
			name="password"
			error={$errors.password?.join(', ')}
			type="password"
			required
		/>
		<AppInput
			placeholder="Re-enter password"
			name="repassword"
			error={$errors.repassword?.join(', ')}
			type="password"
			required
		/>
		<AppInput
			placeholder="First name"
			name="firstName"
			error={$errors.firstName?.join(', ')}
			type="text"
			required
		/>
		<AppInput
			placeholder="Last name"
			name="lastName"
			error={$errors.lastName?.join(', ')}
			type="text"
			required
		/>

		<div class="h-1" />
		<AppButton>Register</AppButton>
	</form>
</section>

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50">
		<div class="w-96 h-96 bg-white rounded-md shadow-md mx-auto translate-y-1/2 p-4 flex flex-col">
			<h1 class="text-2xl">Register success</h1>

			<div class="mx-auto w-full">
				<Checkmark class="w-24 h-24 text-green-500" />
			</div>

			<div class="border-dashed p-2">
				<p class="text-sm">You can now login with your new account</p>
			</div>

			<div class="flex-1" />

			<AppButton on:click={() => (showModal = false)}>Close</AppButton>
		</div>
	</div>
{/if}
