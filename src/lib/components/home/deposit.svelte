<script lang="ts">
	import { z } from 'zod';
	import { validator } from '@felte/validator-zod';
	import AppButton from '../appButton.svelte';
	import AppInput from '../appInput.svelte';
	//@ts-ignore
	import { BN } from 'bn.js';

	const validationSchema = z.object({
		bankNumber: z.string().min(10).max(10),
		amount: z.string().refine((value) => {
			try {
				const bn = new BN(value);
				return bn.gte(new BN(0));
			} catch (error) {
				return false;
			}
		}, 'Amount must be greater than 0'),
		message: z.string().optional()
	});

	import { createForm } from 'felte';
	import client from '$lib/utils/client';
	import toast from 'svelte-french-toast';

	const { form, errors } = createForm<z.infer<typeof validationSchema>>({
		onSubmit: async (values) => {
			try {
				console.log(values);
				toast.promise(
					client.post('/api/employee/deposit', {
						...values,
						amount: new BN(values.amount).toString()
					}),
					{
						loading: 'Depositing...',
						success: 'Deposit successful',
						//@ts-ignore
						error: (e) => {
							console.log(e);

							return e?.message || 'Something went wrong';
						}
					}
				);
			} catch (e) {
				console.log(e);
				return;
			}
		},
		extend: validator({ schema: validationSchema })
	});
</script>

<section class="rounded-md border border-green-300 [&>*]:p-4">
	<h2 class="bg-green-200">Deposit</h2>
	<form class="space-y-2" use:form>
		<AppInput
			placeholder="Bank number"
			name="bankNumber"
			error={$errors.bankNumber?.join('<br/>')}
		/>
		<AppInput placeholder="Deposit amount" name="amount" error={$errors.amount?.join('<br/>')} />
		<AppInput placeholder="Message" name="message" error={$errors.message?.join('<br/>')} />

		<div class="h-1" />
		<AppButton>Deposit</AppButton>
	</form>
</section>
