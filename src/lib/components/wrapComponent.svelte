<script lang="ts">
	import type { ComponentType, SvelteComponentTyped } from 'svelte';

	export let condition = true;
	export let component: ComponentType<SvelteComponentTyped>;

	// interface $$Props extends
</script>

{#if condition}
	<svelte:component this={component} {...$$restProps} />
{:else}
	<slot />
{/if}
