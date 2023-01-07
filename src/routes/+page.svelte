<script lang="ts">
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import AdminManage from '$lib/components/home/adminManage.svelte';
	import Deposit from '$lib/components/home/deposit.svelte';
	import { Tab, TabGroup, TabPanels, TabList, TabPanel } from '@rgossiaux/svelte-headlessui';
</script>

<svelte:head>
	<title>Admin Home - {PUBLIC_SITE_NAME}</title>
</svelte:head>

<div class="grid space-y-4">
	<h1 class="text-sm">Welcome to SvelteKit</h1>

	<TabGroup class="space-y-3">
		<TabList class="">
			<Tab>
				<h2
					class="text-white font-mono px-6 py-2 bg-gradient-to-t from-pink-300 to-pink-400 rounded-md active:translate-y-1"
				>
					Employee management
				</h2>
			</Tab>
			<Tab>
				<h2
					class="text-white font-mono px-6 py-2 bg-gradient-to-t from-pink-300 to-pink-400 rounded-md active:translate-y-1"
				>
					Deposit
				</h2>
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel>
				<AdminManage />
			</TabPanel>
			<TabPanel>
				<Deposit />
			</TabPanel>
		</TabPanels>
	</TabGroup>
</div>
