<script lang="ts">
	import { LightPaginationNav } from 'svelte-paginate';
	import AppButton from '$lib/components/appButton.svelte';
	import {
		putEmployeeSchema,
		useFetchAllEmployees,
		useUpdateEmployee
	} from '$lib/queries/employee';
	import type { PutEmployee } from '$lib/queries/employee';
	import type { EmployeeResponse } from '$lib/queries/employee';
	import type { BaseResponse } from '$lib/store/auth/auth.store';
	import classNames from 'classnames';
	import { TrashOutline, CreateOutline, SaveOutline } from 'svelte-ionicons';
	import Spinner from '$lib/components/spinner.svelte';
	import AppInput from '$lib/components/appInput.svelte';
	import WrapComponent from '$lib/components/wrapComponent.svelte';
	import type { SvelteComponentTyped } from 'svelte';
	import { Query } from '@sveltestack/svelte-query';
	import client from '$lib/utils/client';
	import toast from 'svelte-french-toast';

	let limit = 10;
	let offset = 0;

	// Edit state
	let editState: {
		rowIndex: number | null;
		data: PutEmployee;
		employeeId: string | null;
	} | null = null;

	const columns: {
		name: keyof PutEmployee | 'actions' | 'id';
		label: string;
		cell?: (props: { row: PutEmployee; rowIndex: number }) => SvelteComponentTyped;
	}[] = [
		{
			name: 'id',
			label: 'ID'
		},
		{
			name: 'email',
			label: 'Email'
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

	const queryResult = useFetchAllEmployees({ limit, offset });

	const updateEmployee = useUpdateEmployee();
	let refetched = false;

	const handleSaveClick = async () => {
		const { data, employeeId } = editState || {};

		if (!data || !employeeId) {
			return;
		}

		try {
			await putEmployeeSchema.parseAsync(data);
		} catch (error) {
			console.error(error);
			return;
		}

		const response = $updateEmployee.mutateAsync({
			id: employeeId,
			data
		});
		toast.promise(response, {
			loading: 'Saving...',
			// @ts-ignore
			success: (data) => {
				editState = null;
				refetched = false;
				return `Edit user ${data.data.data.firstName} ${data.data.data.lastName} success!`;
			},
			//@ts-ignore
			error: (e) => {
				return e.message || 'Something went wrong';
			}
		});
	};

	$: if (refetched === false) {
		$queryResult.refetch();
		refetched = true;
	}
</script>

<div class="grid space-y-4">
	<h1 class="text-sm">Welcome to SvelteKit</h1>

	<section class="overflow-x-auto rounded-md border">
		{#if !$queryResult?.data}
			<Spinner />
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
					{#each $queryResult.data.data.data.data || [] as employee, i}
						<tr
							class={classNames('text-left', {
								'bg-gray-200': i % 2 === 1
							})}
						>
							{#each columns as column}
								{#if column.name === 'actions'}
									<td class="flex space-x-1.5 h-14 items-center min-w-min">
										{#if editState?.rowIndex === i}
											<AppButton
												preset="filled"
												size="xs"
												on:click={handleSaveClick}
												disabled={$updateEmployee.isLoading}
											>
												<SaveOutline class="h-4" />
											</AppButton>
										{/if}
										<AppButton
											preset="outlined"
											size="xs"
											on:click={() => {
												if (editState?.rowIndex === i) {
													editState = null;
													return;
												}

												editState = {
													data: {
														...employee
													},
													rowIndex: i,
													employeeId: employee.id
												};
											}}
										>
											<CreateOutline class="h-4" />
										</AppButton>
										<AppButton preset="error" size="xs">
											<TrashOutline class="h-4" />
										</AppButton>
									</td>
								{:else if column.name === 'id'}
									<div class="ml-4 truncate">
										{employee[column.name]}
									</div>
								{:else}
									<td class="h-14">
										<WrapComponent condition={editState?.rowIndex !== i}>
											<div class="ml-4 truncate">
												{employee[column.name]}
											</div>
											<svelte:fragment slot="fallback">
												<AppInput
													size="sm"
													className="h-full"
													containerClass="px-2"
													disabled={$updateEmployee.isLoading}
													on:change={(e) => {
														if (editState)
															editState = {
																...editState,
																data: {
																	...editState?.data,
																	// @ts-ignore
																	[column.name]: e?.target?.value
																}
															};
													}}
													value={editState?.data[column.name]}
												/>
											</svelte:fragment>
										</WrapComponent>
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>

			<LightPaginationNav
				totalItems={$queryResult.data.data.data.metadata.total}
				pageSize={limit}
				currentPage={Math.ceil(offset / limit) + 1}
				{limit}
				showStepOptions={true}
				on:setPage={(e) => {
					offset = e.detail.page * limit - limit;
					editState = null;
				}}
			/>
		{/if}
	</section>
</div>
