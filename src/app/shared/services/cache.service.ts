import { Injectable } from '@angular/core';


@Injectable()
export class CacheService {

	private cacheName: string = '';

	constructor() {
		// this.cacheName = 'ngsw:1:data:dynamic:bin-api-performance:cache';
		// ngsw:/:1:data:dynamic:api-session:cache - Dynamic API cache for PWA app
	}

	async clearAllCache(refresh = false) {
		await this.clearCacheByNameOrAll(this.cacheName, true, refresh);
	}

	async clearCache(cacheName: string, baseUrl: string, reload: boolean = false) {
		if (baseUrl) {
			await this.clearCacheByUrl(cacheName, baseUrl);
		} else {
			await this.clearCacheByNameOrAll(cacheName, false, reload);
		}
	}

	/**
	 * @param nameCacheParam
	 * @param allKeys
	 */
	private clearCacheByNameOrAll(nameCacheParam: string, allKeys: boolean = false, reload: boolean = false) {
		if (window.Cache === undefined) return;
		caches.keys().then(async (cacheNames) => {
			await Promise.all(
				cacheNames.filter((cacheName) => {
					console.log(cacheName);
					if (allKeys) return true;
					// if (nameCacheParam == cacheName) return true;
					if (nameCacheParam && cacheName.startsWith(nameCacheParam)) return true;
					return false;
				}).map((cacheName) => {
					return caches.delete(cacheName).then((res) => this.logDelete(res, cacheName));
				})
			);
		}).then(() => {
			if (reload) {
				location.reload();
			}
		});
	}

	/**
	 * @param nameCache
	 * @param url
	 */
	private clearCacheByUrl(nameCache: string, url: string) {
		caches.open(nameCache).then((c) => {
			c.keys().then((keys) => {
				keys.filter((p) => { return p.url.includes(url) })
					.map((keySearched) => c.delete(keySearched.url).then((res) => this.logDelete(res, keySearched)))
			})
		});
	}

	private logDelete(result: boolean, cache: any) {
		console.log(`eliminado de cache para ${cache} =>`, (result ? 'Satisfactorio' : 'Fallido'));
	}

}
