import { isEqual } from 'lodash';

/**
 * @description
 * This function is used to determine whether or not a certain key exists in the cache.
 *
 * @param key - The key to check for.
 * @returns True if the key exists in the cache, false otherwise.
 */

class Cache {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cache = new Map<string, any>();

	public clear = () => {
		this.cache.clear();
	};
}

class CustomCache extends Cache {
	/**
	 * Function to invalidate cache
	 *
	 * For example, if you have a cache key like this: ['user', '1']
	 * and you want to invalidate all cache keys that start with ['user']
	 * you can pass ['user'] as inputKey
	 *
	 * @param key - cache key
	 * @returns cache object
	 */

	public invalidateCache = (key: string[]) => {
		const a = key;

		this.cache.forEach((_, key) => {
			const b = JSON.parse(key);

			// we have both inpuKey and parsedKey is array, check if they are equal
			if (b?.length < a?.length) {
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (a.every((item: any, index: string | number) => isEqual(item, b[index]))) {
				cache.delete(key);
				console.log('Invalidated cache', key);
			}
		});

		return cache;
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public set = (key: any[] | string, value: any) => {
		const parsedKey = typeof key !== 'string' ? JSON.stringify(key) : key;

		this.cache.set(parsedKey, value);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get = (key: any[] | string) => {
		const parsedKey = this.serilizeKey(key);

		return this.cache.get(parsedKey);
	};

	public has = (key: string | string[]) => {
		const parsedKey = this.serilizeKey(key);

		return this.cache.has(parsedKey);
	};

	public delete = (key: string | string[]) => {
		const parsedKey = this.serilizeKey(key);
		this.cache.delete(parsedKey);
	};

	private serilizeKey = (key: string | string[]) => {
		return typeof key === 'string' ? key : JSON.stringify(key);
	};
}

export const cache = new CustomCache();

export const clearCache = () => {
	cache.clear();
};

export const invalidateCache = (key: string[]) => {
	cache.invalidateCache(key);
};
