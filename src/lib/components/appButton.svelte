<script lang="ts">
	const presets = {
		filled: {
			classNames: 'bg-gradient-to-tl from-blue-500 to-blue-400 hover:bg-opacity-80 text-white',
			shadow: 'shadow-md hover:shadow-lg hover:shadow-blue-300 hover:shadow-opacity-50'
		},
		outlined: {
			classNames: 'bg-transparent border border-blue-500 text-blue-500',
			shadow: ''
		}
	};

	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['button']> {
		className?: string;
		disabled?: boolean;
		isLoading?: boolean;
		type?: 'button' | 'submit';
		preset?: keyof typeof presets;
		btnSize?: 'sm' | 'md' | 'lg';
	}

	export const className = '';
	export const disabled = false;
	export const leftIcon = '';
	export const isLoading = false;
	export const preset: $$Props['preset'] = 'filled';
	export const size: $$Props['btnSize'] = 'md';

	// @ts-ignore
	const sizeClass: Record<$$Props['btnSize'], string> = {
		sm: 'h-8 text-sm',
		md: 'h-10',
		lg: 'h-[3.25rem]'
	};
</script>

<button
	class={`flex items-center justify-center rounded-lg py-2 hover:bg-opacity-80 transition-[transform,box-shadow] hover:-translate-y-0.5 ${
		!className?.includes('px-') ? 'px-4' : ''
	} ${presets[preset || 'filled'].classNames} ${className} ${sizeClass[size]}`}
	class:cursor-not-allowed,opacity-50={disabled}
	disabled={disabled || isLoading}
	on:click
	{...$$restProps}
>
	{#if isLoading}
		Loading...
	{:else}
		{#if leftIcon}
			<span class="mr-2">{leftIcon}</span>
		{/if}
		<slot />
	{/if}
</button>
