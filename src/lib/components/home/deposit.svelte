<script lang="ts">
	import AppButton from '../appButton.svelte';
	import AppInput from '../appInput.svelte';

	let depositAmount: string;
	let bankNumber: string;
</script>

<section class="rounded-md border border-green-300 [&>*]:p-4">
	<h2 class="bg-green-200">Deposit</h2>

	<div class="space-y-2">
		<AppInput bind:value={bankNumber} placeholder="Bank number" />
		<AppInput bind:value={depositAmount} placeholder="Deposit amount" />

		<div class="h-1" />
		<AppButton>Deposit</AppButton>
	</div>
</section>
