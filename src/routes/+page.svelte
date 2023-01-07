<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import AdminManage from '$lib/components/home/adminManage.svelte';
	import Deposit from '$lib/components/home/deposit.svelte';
	import RegisterNewCustomer from '$lib/components/home/registerNewCustomer.svelte';
	import TabItem from '$lib/components/tabItem.svelte';
	import { Tab, TabGroup, TabPanels, TabList, TabPanel } from '@rgossiaux/svelte-headlessui';
</script>

<svelte:head>
	<title>Admin Home - {PUBLIC_SITE_NAME}</title>
</svelte:head>

<div class="grid overflow-x-auto relative z-10">
	<h1 class="text-sm">Welcome to SvelteKit</h1>

	<div class="h-2" />

	<div class="flex">
		<TabItem
			on:click={() => {
				goto('/transactions');
			}}>Transactions</TabItem
		>
	</div>

	<div class="h-2" />

	<TabGroup class="space-y-3">
		<TabList class="">
			<Tab>
				<TabItem>Employee management</TabItem>
			</Tab>
			<Tab>
				<TabItem>Deposit</TabItem>
			</Tab>
			<Tab>
				<TabItem>Register new customer</TabItem>
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel>
				<AdminManage />
			</TabPanel>
			<TabPanel>
				<Deposit />
			</TabPanel>
			<TabPanel>
				<RegisterNewCustomer />
			</TabPanel>
		</TabPanels>
	</TabGroup>
</div>
