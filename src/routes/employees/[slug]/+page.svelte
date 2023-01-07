<script lang="ts">
	import { page } from '$app/stores';
	import AppButton from '$lib/components/appButton.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import client from '$lib/utils/client';
	import { LightPaginationNav } from 'svelte-paginate';

	interface RootObject {
		data: Data;
	}

	interface Data {
		data: Datum[];
		metadata: Metadata;
	}

	interface Metadata {
		total: number;
		page: number;
		limit: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	}

	interface Datum {
		id: string;
		data: string;
		type: string;
		createdAt: string;
	}

	let slug = $page.params.slug;
	const LIMIT = 10;
	let offset = 0;

	async function fetchEmployee(offset: number) {
		const response = await client.get<RootObject>(
			`/api/employee/logs/by-employee/${slug}?limit=${LIMIT}&offset=${offset}`
		);
		return response.data;
	}

	$: fetcher = fetchEmployee(offset);
</script>

{#await fetcher}
	<Spinner />
{:then data}
	<div class="border p-2 rounded-md divide-y">
		{#each data.data.data as log}
			<div class="overflow-auto grid-flow-row-dense p-2">
				<div class="font-bold">
					{log.createdAt}:{'\t'}
				</div>
				<div class="font-mono">
					{log.type}<br />
					{log.data}
				</div>
			</div>
		{/each}
		{#if data.data.metadata.total === 0}
			<div class="p-2">No logs found</div>
		{/if}
		<!-- next page -->
		<LightPaginationNav
			totalItems={data.data?.metadata.total}
			pageSize={LIMIT}
			currentPage={Math.ceil(offset / LIMIT) + 1}
			{LIMIT}
			showStepOptions={true}
			on:setPage={(e) => {
				offset = e.detail.page * LIMIT - LIMIT;
			}}
		/>
	</div>
{:catch error}
	{error.message}
{/await}
