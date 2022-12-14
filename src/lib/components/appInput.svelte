<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']> {
		value?: string;
		placeholder?: string;
		className?: string;
		clearable?: boolean;
		hiddenable?: boolean;
		error?: string;
		disabled?: boolean;
		isLoading?: boolean;
		required?: boolean;
	}

	export let value = '';
	export let placeholder = '';
	export let className = '';
	export let clearable = false;
	export let hiddenable = false;
	export let error = '';
	export let disabled = false;
	export let required = false;
	export let isLoading = false;

	let input: HTMLInputElement;
	let hiddenValue = false;

	function toggleHidden() {
		hiddenValue = !hiddenValue;

		if (hiddenValue) {
			input.type = 'password';
		} else {
			input.type = 'text';
		}
	}

	function handleClearClick() {
		value = '';
	}
</script>

<label class="relative inline-block w-full">
	<input
		class="peer w-full rounded-xl bg-gray-100 px-3 outline-none transition-[padding,box-shadow] focus:shadow-md h-12{className
			? ` ${className}`
			: ''} {value?.length ? 'pt-4 pb-1' : 'pt-3 pb-2'} focus:pt-4 focus:pb-1"
		class:cursor-not-allowed,bg-gray-300={disabled}
		{disabled}
		placeholder=" "
		{...$$restProps}
		bind:value
		bind:this={input}
	/>
	<span
		class="absolute left-3 top-1 select-none text-xs text-gray-500 transition-[top,font-size] placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs"
	>
		{placeholder}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</span>

	{#if !disabled}
		<span class="absolute right-4 top-4 flex cursor-pointer items-center gap-1">
			{#if isLoading}
				<span>
					<svg
						class="animate-spin h-5 w-5 text-gray-500"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
					</svg>
				</span>
			{:else}
				{#if clearable && !!value?.length}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span on:click={handleClearClick} class="cursor-pointer" aria-label="Clear">
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
								fill="currentColor"
								fill-rule="evenodd"
								clip-rule="evenodd"
							/></svg
						>
					</span>
				{/if}
				{#if hiddenable}
					<span
						class="cursor-pointer"
						class:hidden={!value?.length}
						on:click={toggleHidden}
						aria-label="Show/Hide"
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								toggleHidden();
							}
						}}
					>
						{#if !hiddenValue}
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-500"
								><path
									d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
									fill="currentColor"
									fill-rule="evenodd"
									clip-rule="evenodd"
								/></svg
							>
						{:else}
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-500"
								><path
									d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
									fill="currentColor"
									fill-rule="evenodd"
									clip-rule="evenodd"
								/></svg
							>
						{/if}
					</span>
				{/if}
			{/if}
		</span>
	{/if}
</label>

{#if error}
	<span class="text-red-500 text-sm mt-1">{error}</span>
{/if}
