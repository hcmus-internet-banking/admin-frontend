<script lang="ts">
	import AppButton from '$lib/components/appButton.svelte';
	import { useGetEmployees } from '$lib/queries/employee';
	import { authStore } from '$lib/store/auth/auth.store';
	import { get } from 'svelte/store';
	import classNames from 'classnames';
	import { TrashOutline, CreateOutline, SaveOutline } from 'svelte-ionicons';
	import type { Employee } from '$lib/queries/employee';
	import Spinner from '$lib/components/spinner.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import WrapComponent from '$lib/components/wrapComponent.svelte';
	import type { ComponentType, SvelteComponent, SvelteComponentTyped } from 'svelte';

	let user = get(authStore.user);
	let limit = 10;
	let offset = 0;

	// Edit
	let editState: {
		rowIndex: number | null;
	} = {
		rowIndex: null
	};

	const queryResult = useGetEmployees(limit, offset);

	const columns: {
		name: keyof Employee | 'actions';
		label: string;
		cell?: (props: { row: Employee; rowIndex: number }) => SvelteComponentTyped;
	}[] = [
		{
			name: 'id',
			label: 'ID'
		},
		{
			name: 'firstName',
			label: 'First Name'
		},
		{
			name: 'lastName',
			label: 'Last Name'
		},
		{
			name: 'employeeType',
			label: 'Employee Type'
		},
		{
			name: 'actions',
			label: 'Actions'
		}
	];
</script>

<div class="grid space-y-4">
	<h1 class="text-sm">Welcome to SvelteKit</h1>

	<section class="overflow-x-auto rounded-md border">
		{#if !$queryResult?.data}
			<Spinner />
		{:else if $queryResult.data.length === 0}
			<p>No employees found.</p>
		{:else}
			<table class="md:table-fixed w-full whitespace-nowrap">
				<thead>
					<tr class="text-left text-sm font-semibold bg-gray-200 truncate">
						{#each columns as column}
							<th class="p-4">{column.label}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each $queryResult.data || [] as employee, i}
						<tr
							class={classNames('text-left', {
								'bg-gray-200': i % 2 === 1
							})}
						>
							{#each columns as column}
								{#if column.name === 'actions'}
									<td class="flex space-x-1.5 h-14 items-center min-w-min">
										<!-- Save -->
										{#if editState.rowIndex === i}
											<AppButton preset="filled" size="xs">
												<SaveOutline class="h-4" />
											</AppButton>
										{/if}
										<AppButton
											preset="outlined"
											size="xs"
											on:click={() => {
												if (editState.rowIndex === i) {
													editState.rowIndex = null;
													return;
												}

												editState.rowIndex = i;
											}}
										>
											<CreateOutline class="h-4" />
										</AppButton>
										<AppButton preset="error" size="xs">
											<TrashOutline class="h-4" />
										</AppButton>
									</td>
								{:else}
									<td class="h-14">
										<WrapComponent
											component={AppInput}
											condition={editState.rowIndex === i}
											size="sm"
											on:change={() => {
												console.log('Hi there');
											}}
											className="h-full"
											containerClass="px-2"
											bind:value={employee[column.name]}
										>
											<div class="ml-4 truncate">
												{employee[column.name]}
											</div>
										</WrapComponent>
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>
