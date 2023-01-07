<script lang="ts">
	import { authStore } from '$lib/store/auth/auth.store';
	import client from '$lib/utils/client';

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
		amount: string;
		createdAt: string;
		fromCustomer: FromCustomer;
		toCustomer: FromCustomer;
		message: string;
		id: string;
		type: string;
	}

	interface FromCustomer {
		id: string;
		accountNumber: string;
		lastName: string;
		firstName: string;
	}

	const offset = 0;
	const limit = 10;

	async function fetchTransactions({ offset, limit }: { offset: number; limit: number }) {
		const response = await client.get<RootObject>('/api/employee/transactions', {
			params: {
				offset,
				limit
			}
		});

		return response.data.data;
	}

	$: fetcher = fetchTransactions({ offset, limit });

	$: isLoggedIn = !!authStore.user;
</script>

{#if isLoggedIn}
	{#await fetcher}
		<div>loading...</div>
	{:then transactions}
		<div class="divide-y">
			{#each transactions.data as transaction}
				<div class="p-2">
					<div class="font-mono">
						+{Intl.NumberFormat('en-US').format(Number(transaction.amount))} from {transaction
							.fromCustomer.firstName}
						{transaction.fromCustomer.lastName}
					</div>

					<div class="text-sm">
						<div>
							{transaction.message}
						</div>
						#{transaction.id}
					</div>
				</div>
			{/each}

			{#if transactions.data.length === 0}
				<div class="p-2">
					<div class="font-mono">No transactions</div>
				</div>
			{/if}
		</div>
	{/await}
{:else}
	<!-- Router is /login -->
	You are not logged in
{/if}
