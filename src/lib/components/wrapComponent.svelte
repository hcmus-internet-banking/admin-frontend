<script lang="ts">
	export let condition = true;

	// interface $$Props extends

	interface $$Slot {
		default: {};
		fallback: {};
	}
</script>

{#if condition}
	<slot />
{:else}
	<slot name="fallback" />
{/if}
