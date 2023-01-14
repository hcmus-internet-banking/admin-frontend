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
		fromCustomer?: FromCustomer;
		toCustomer: FromCustomer;
		fromRecipient?: FromRecipient;
		message: string;
		id: string;
		type: string;
	}

	interface FromRecipient {
		id: string;
		accountNumber: string;
		mnemonicName?: any;
		internalBankCustomerId?: any;
		customerRecipient: any[];
		fromTransaction: FromTransaction[];
		internalBankCustomer?: any;
		toTransaction: any[];
		transactions: any[];
	}

	interface FromTransaction {
		id: string;
		amount: string;
		message: string;
		createdAt: string;
		updatedAt: string;
		deletedAt?: any;
		type: string;
		fromCustomerId?: any;
		toCustomerId: string;
		fromRecipientId: string;
		toRecipientId?: any;
		recipientId?: any;
		extBankId?: any;
	}

	interface FromCustomer {
		id: string;
		accountNumber: string;
		lastName: string;
		firstName: string;
	}

	let offset = 0;
	let limit = 10;
	let start_time: Date | null = null;
	let end_time: Date | null = null;

	async function fetchTransactions({
		offset,
		limit,
		start_time,
		end_time
	}: {
		offset: number;
		limit: number;
		start_time: Date | null;
		end_time: Date | null;
	}) {
		const response = await client.get<RootObject>('/api/employee/transactions', {
			params: {
				offset,
				limit,
				startDate: start_time !== null ? start_time : start_time,
				endDate: end_time !== null ? end_time : end_time
			}
		});

		return response.data.data;
	}

	$: fetcher = fetchTransactions({ offset, limit, end_time, start_time });

	$: isLoggedIn = !!authStore.user;
</script>

{#if isLoggedIn}
	<div class="grid md:grid-cols-2 gap-2">
		<div class="grid">
			<label for="start_time" class="ml-1">Start time </label>
			<input
				id="start_time"
				type="date"
				bind:value={start_time}
				placeholder="Start time"
				class="border p-2"
			/>
		</div>

		<div class="grid">
			<label for="end_time" class="ml-1">End time</label>
			<input
				id="end_time"
				type="date"
				bind:value={end_time}
				placeholder="End time"
				class="border p-2"
			/>
		</div>

		<div class="grid">
			<label for="start_time" class="ml-1">Bank </label>
			<select class="border p-2">
				<option value="all">All</option>
				<option value="karma">KarmaBank</option>
			</select>
		</div>
	</div>
	<div class="h-4" />

	{#await fetcher}
		<div>loading...</div>
	{:then transactions}
		<div class="divide-y">
			{#each transactions.data as transaction}
				<div class="p-2">
					<div class="font-mono">
						+{Intl.NumberFormat('en-US').format(Number(transaction.amount))}

						<!-- {#if !!transaction.fromCustomer?.firstName && !!transaction.fromCustomer?.lastName}
							from {transaction.fromCustomer?.firstName}
							{transaction.fromCustomer?.lastName}
						{/if} -->
					</div>

					<div class="text-sm">
						{#if transaction.fromCustomer?.accountNumber}
							<div>
								<b> From account number: </b>{transaction.fromCustomer?.accountNumber}
							</div>
						{/if}
						{#if transaction.fromRecipient?.accountNumber}
							<div>
								<b> From account number: </b>{transaction.fromRecipient?.accountNumber}
							</div>
						{/if}
						<div><b>To account number:</b> {transaction.toCustomer.accountNumber}</div>
						<div>
							<b>Date:</b>
							{Intl.DateTimeFormat('vi-VN').format(new Date(transaction.createdAt))}
						</div>
						<div>
							<b>Message:</b>
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
