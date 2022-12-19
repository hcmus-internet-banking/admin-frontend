import type { Writable } from 'svelte/store';

type WithLoadingParams<T> = {
	loading: Writable<boolean>;
	error?: Writable<unknown>;
	fn: () => Promise<T>;
	onError?: (err: unknown) => void;
	onSettled?: () => void;
};

export async function withLoading<T>({
	error,
	fn,
	loading,
	onError,
	onSettled
}: WithLoadingParams<T>) {
	loading.set(true);
	try {
		return await fn();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		if (error) error.set(err);
		if (onError) onError(err);

		throw err;
	} finally {
		loading.set(false);
		if (onSettled) onSettled();
	}
}
