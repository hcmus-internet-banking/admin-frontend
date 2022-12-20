import { derived, writable } from 'svelte/store';
import { cache } from './cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSWR = <T>(key: any[], fetcher: () => Promise<T>) => {
	const store = writable<T | null>();
	const error = writable<Error | null>(null);
	const isLoading = writable(false);
	const data = derived(store, ($store) => {
		return $store;
	});

	const load = async () => {
		if (cache.has(key)) {
			store.set(cache.get(key));
			isLoading.set(false);
			error.set(null);
			return;
		}

		isLoading.set(true);

		fetcher()
			.then((res) => {
				error.set(null);
				store.set(res);
				cache.set(key, res);
			})
			.catch((err) => {
				error.set(err);
				store.set(null);
			})
			.finally(() => {
				isLoading.set(false);
			});
	};

	load();

	return {
		data,
		isLoading: derived(isLoading, (isLoading) => isLoading),
		error: derived(error, (error) => error),
		refetch: async () => {
			cache.invalidateCache(key);
			load();
		},
		mutate: async (data: T) => {
			cache.set(key, data);
			store.set(data);
			isLoading.set(false);
			error.set(null);
		}
	};
};
