<script>
	import { getUserAssetsFromCollection } from '$lib/modules/opensea';
	import { sleep } from '$lib/modules/utils';
	import { signerAddress } from '$lib/modules/wallet';
	import cart from '$lib/stores/cart';
	import { onDestroy } from 'svelte';
	import Button from '../Button.svelte';
	import Loader from '../Loader.svelte';
	import CollectionItemCard from './CollectionItemCard.svelte';

	export let collection;

	let items = [];
	let loading = false;
	let stop = false;

	$: fetchCollection(collection, $signerAddress);

	async function fetchCollection(collection, signer) {
		// reset collections
		items = [];

		if (loading) return;
		if (!signer) return;
		loading = true;

		let hasMore = false;
		let page = 1;
		let perPage = 50;
		do {
			hasMore = false;

			const results = await getUserAssetsFromCollection(signer, collection.slug, page, perPage);

			if (results.error) {
				console.log(results.error);
				return;
			}

			items.push(...results);
			items = items;

			if (results.length == perPage) {
				hasMore = true;
				page++;
			}
		} while (hasMore && !stop);

		items = items;
		loading = false;
	}

	onDestroy(() => {
		stop = true;
	});
</script>

<div class="items">
	{#each items as item}
		<CollectionItemCard {item} />
	{/each}
</div>
{#if loading}
	<Loader />
{/if}

<style lang="postcss">
	.items {
		@apply grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4;
		padding-bottom: 80px;
	}
</style>
