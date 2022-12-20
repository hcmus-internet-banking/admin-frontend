<script lang="ts">
	import { z } from 'zod';
	import { validator } from '@felte/validator-zod';
	import AppButton from '../appButton.svelte';
	import AppInput from '../appInput.svelte';

	const validationSchema = z.object({
		depositAmount: z.string().min(1),
		bankNumber: z.string().min(1)
	});

	import { createForm } from 'felte';

	const { form, errors } = createForm<z.infer<typeof validationSchema>>({
		onSubmit: async (values) => {
			try {
				console.log(values);
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
		<AppInput
			placeholder="Deposit amount"
			name="depositAmount"
			error={$errors.depositAmount?.join('<br/>')}
		/>

		<div class="h-1" />
		<AppButton>Deposit</AppButton>
	</form>
</section>
