<script lang="ts">
	import {
		putEmployeeSchema,
		tableColumns,
		useDeleteEmployee,
		useUpdateEmployee,
		type EmployeeResponse,
		type PutEmployee
	} from '$lib/queries/employee';
	import { useSWR } from '$lib/store/load/load.store';
	import { clearCache, invalidateCache } from '$lib/store/load/cache';
	import client from '$lib/utils/client';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions
	} from '@rgossiaux/svelte-headlessui';
	import classNames from 'classnames';
	import toast from 'svelte-french-toast';
	import { CreateOutline, SaveOutline, TrashOutline } from 'svelte-ionicons';
	import { LightPaginationNav } from 'svelte-paginate';
	import AppButton from '../appButton.svelte';
	import AppInput from '../appInput.svelte';
	import Spinner from '../spinner.svelte';
	import WrapComponent from '../wrapComponent.svelte';

	let limit = 10;
	let offset = 0;

	// Edit state
	let editState: {
		rowIndex: number | null;
		data: PutEmployee;
		employeeId: string | null;
	} | null = null;

	const updateEmployee = useUpdateEmployee();
	const deleteEmployee = useDeleteEmployee();

	const handleSaveClick = async () => {
		const { data, employeeId } = editState || {};

		if (!data || !employeeId) {
			return;
		}

		await putEmployeeSchema.parseAsync(data).catch((e) => {
			console.log(e);
			return;
		});

		const response = $updateEmployee.mutateAsync({
			id: employeeId,
			data
		});
		toast.promise(response, {
			loading: 'Saving...',
			// @ts-ignore
			success: (data) => {
				editState = null;
				refetch();
				return `Edit user ${data.data.data.firstName} ${data.data.data.lastName} success!`;
			},
			//@ts-ignore
			error: (e) => {
				return e.message || 'Something went wrong';
			}
		});
	};

	$: ({ data, error, isLoading, refetch } = useSWR<EmployeeResponse>(
		['employees', { limit, offset }],
		async () => {
			return (
				await client.get('/api/employee', {
					params: {
						limit,
						offset
					}
				})
			).data?.data;
		}
	));

	let isDeleteDialogOpen = false;
	let idToDelete: string | null = null;
</script>

<Dialog
	open={isDeleteDialogOpen}
	on:close={() => (isDeleteDialogOpen = false)}
	class="fixed inset-0"
>
	<DialogOverlay class="fixed inset-0 bg-black opacity-50 -z-10" />

	<div class="max-w-5xl bg-white mx-auto rounded-md mt-40 space-y-3 overflow-hidden">
		<div class="p-4">
			<DialogTitle>Delete account</DialogTitle>
			<DialogDescription>This will permanently delete your account</DialogDescription>

			<p>
				Are you sure you want to delete your account? All of your data will be permanently removed.
				This action cannot be undone.
			</p>
		</div>

		<div class="flex gap-2 bg-gray-100 justify-end px-4 py-2">
			<AppButton
				on:click={() => {
					isDeleteDialogOpen = false;
					if (!idToDelete) return;
					const response = $deleteEmployee.mutateAsync(idToDelete);

					toast.promise(response, {
						loading: 'Deleting...',
						// @ts-ignore
						success: (data) => {
							clearCache();
							return `Delete user ${data.data.data.firstName} ${data.data.data.lastName} success!`;
						},
						//@ts-ignore
						error: (e) => {
							return e.message || 'Something went wrong';
						}
					});
				}}
				preset="outlined">Delete</AppButton
			>
			<AppButton on:click={() => (isDeleteDialogOpen = false)}>Cancel</AppButton>
		</div>
	</div>
</Dialog>

<section class="overflow-x-auto rounded-md border">
	{#if $isLoading}
		<Spinner />
	{:else if $error}
		<div class="p-4">
			<p class="text-red-500">Error: {$error.message}</p>
		</div>
	{:else}
		<table class="md:table-fixed w-full whitespace-nowrap">
			<thead>
				<tr class="text-left text-sm font-semibold bg-gray-200 truncate">
					{#each tableColumns as column}
						<th class="p-4">{column.label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each $data?.data || [] as employee, i}
					<tr
						class={classNames('text-left', {
							'bg-gray-200': i % 2 === 1
						})}
					>
						{#each tableColumns as column}
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
									<AppButton
										preset="error"
										size="xs"
										on:click={() => {
											isDeleteDialogOpen = true;
											idToDelete = employee.id;
										}}
									>
										<TrashOutline class="h-4" />
									</AppButton>
								</td>
							{:else if column.name === 'id'}
								<td>
									<div class="ml-4 truncate">
										{employee[column.name]}
									</div>
								</td>
							{:else if column.name === 'employeeType'}
								<td class="relative">
									<WrapComponent condition={editState?.rowIndex !== i}>
										<div class="ml-4 truncate">
											{employee[column.name]}
										</div>
										<svelte:fragment slot="fallback">
											<Listbox
												value={editState?.data[column.name]}
												on:change={(e) => {
													//@ts-ignore
													if (editState) editState.data[column.name] = e.detail;
												}}
											>
												<ListboxButton class="relative">
													<AppInput
														size="sm"
														className="h-full"
														containerClass="px-2"
														disabled={$updateEmployee.isLoading}
														value={editState?.data[column.name]}
													/>
												</ListboxButton>
												<ListboxOptions
													class="absolute w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto z-10 top-10"
												>
													<ListboxOption value="ADMIN">
														<div class="p-2 truncate">Admin</div>
													</ListboxOption>
													<ListboxOption value="EMPLOYEE">
														<div class="p-2 truncate">Employee</div>
													</ListboxOption>
												</ListboxOptions>
											</Listbox>
										</svelte:fragment>
									</WrapComponent>
								</td>
							{:else}
								<td class="h-14 relative">
									<WrapComponent condition={editState?.rowIndex !== i}>
										<div class="ml-4 truncate">
											{employee[column.name]}
										</div>
										<svelte:fragment slot="fallback">
											<AppInput
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
			totalItems={$data?.metadata.total}
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

	<!-- <AppButton
		on:click={() => {
			invalidateCache(['employees']);
		}}>Invalidate</AppButton
	> -->
</section>
