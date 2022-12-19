import client from '$lib/utils/client';
import type { AxiosRequestConfig } from 'axios';
import { writable } from 'svelte/store';
import type { BaseResponse } from './../auth/auth.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

export const invalidateCache = (url: string) => {
	cache.delete(url);
};
export const clearCache = () => {
	cache.clear();
};

export const fetchUrl = <T>(url: string, config: AxiosRequestConfig) => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const store = writable<Promise<T>>(new Promise(() => {}));

	if (cache.has(url)) {
		console.log(cache);

		store.set(Promise.resolve(cache.get(url)));
		return store;
	}

	const load = async () => {
		const res = await client<BaseResponse<T>>(url, config);

		if (res.status === 200) {
			console.log(res.status);
			store.set(Promise.resolve(res.data.data));

			if (res.config.url) cache.set(res.config.url, res.data.data);
		} else {
			store.set(Promise.reject(res.data));
		}
	};

	load();

	return store;
};
