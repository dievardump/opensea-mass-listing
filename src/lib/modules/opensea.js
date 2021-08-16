import env from "./env";
import { sleep } from "./utils";

const PREFIX = env.VITE_OPENSEA_API_PREFIX;

const queue = {
	items: [],
	processing: false,
	add(toProcess) {
		this.items.push(toProcess);
		this._processNext();
	},

	async _processNext() {
		if (this.processing) return;
		if (this.items.length == 0) return;

		this.processing = true;
		const fn = this.items.shift();
		await fn();
		// add a delay of 1 second between processings
		await sleep(1000);
		this.processing = false;

		this._processNext();
	}
}

export async function getUserCollections(owner, page, perPage) {
	return new Promise((resolve, reject) => {
		queue.add(async () => {
			const url = new URL(PREFIX + 'collections');
			url.searchParams.set('offset', (page - 1) * perPage);
			url.searchParams.set('limit', perPage);
			url.searchParams.set('asset_owner', owner.toLowerCase());

			resolve(await fetch(url).then(res => res.json()).catch(e => ({ success: false, error: e.message })));
		});
	});
}

export async function getUserAssetsFromCollection(owner, collection, page, perPage) {
	return new Promise((resolve, reject) => {
		queue.add(async () => {
			const url = new URL(PREFIX + 'assets');
			url.searchParams.set('offset', (page - 1) * perPage);
			url.searchParams.set('limit', perPage);
			url.searchParams.set('collection', collection);
			url.searchParams.set('owner', owner.toLowerCase())
			resolve(await fetch(url).then(res => res.json()).then(json => json.assets).catch(e => ({ success: false, error: e.message })));
		});
	});
}