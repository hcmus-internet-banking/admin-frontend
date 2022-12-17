import type { Writable } from 'svelte/store';

type WithLoadingOptions = {
	onError?: (err: unknown) => void;
	onSettled?: () => void;
};

type WithLoadingParams<T> = {
	loading: Writable<boolean>;
	error?: Writable<unknown>;
	fn: () => Promise<T>;
};

export async function withLoading<T>(
	{ error, fn, loading }: WithLoadingParams<T>,
	{ onError, onSettled }: WithLoadingOptions = {}
) {
	loading.set(true);
	try {
		return await fn();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		if (error) error.set(err);
		if (onError) onError(err);
	} finally {
		loading.set(false);
		if (onSettled) onSettled();
	}
}
