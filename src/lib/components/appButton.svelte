<script lang="ts">
	import classNames from 'classnames';

	const presets = {
		filled: {
			classNames: 'bg-gradient-to-tl from-blue-500 to-blue-400 hover:bg-opacity-80 text-white',
			shadow: 'shadow-md hover:shadow-lg hover:shadow-blue-300 hover:shadow-opacity-50'
		},
		outlined: {
			classNames: 'bg-transparent border border-blue-500 text-blue-500',
			shadow: ''
		},
		error: {
			classNames: 'bg-red-500 text-white',
			shadow: 'shadow-md hover:shadow-lg hover:shadow-red-300 hover:shadow-opacity-50'
		}
	};

	interface $$Props
		extends Omit<svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['button']>, 'size'> {
		className?: string;
		disabled?: boolean;
		isLoading?: boolean;
		type?: 'button' | 'submit';
		preset?: keyof typeof presets;
		href?: string;
		leftIcon?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
	}

	export let className = '';
	export let disabled = false;
	export let leftIcon = '';
	export let isLoading = false;
	export let preset: $$Props['preset'] = 'filled';
	export let size: $$Props['size'] = 'md';

	// @ts-ignore
	const sizeClass: Record<$$Props['btnSize'], string> = {
		xs: 'h-6 text-xs',
		sm: 'h-8 text-sm',
		md: 'h-10',
		lg: 'h-[3.25rem]'
	};
</script>

<button
	class={classNames(
		`flex items-center justify-center rounded-lg py-2 hover:bg-opacity-80 transition-[transform,box-shadow] hover:-translate-y-0.5 ${
			disabled ? 'cursor-not-allowed opacity-50' : ''
		} ${presets[preset || 'filled'].classNames} ${className} ${sizeClass[size || 'md']}`,
		!className?.includes('px-') ? 'px-10' : ''
	)}
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
