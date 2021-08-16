<script>
	import { page } from '$app/stores';
	import { getUserCollections } from '$lib/modules/opensea';
	import { sleep } from '$lib/modules/utils';

	import collections from '$lib/stores/collections';
	import { onDestroy } from 'svelte';
	import Loader from '../Loader.svelte';

	export let signer;

	let items = [];
	let locked = false;
	let stop = false;

	// reactive
	$: fromSigner(signer);

	// functions
	async function fromSigner(signer) {
		// reset collections
		items = [];
		$collections.selected = null;

		if (!signer) return;
		$collections.loading = true;

		let hasMore = false;
		let page = 1;
		let perPage = 300;
		do {
			hasMore = false;

			const results = await getUserCollections(signer, page, perPage);

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

		$collections.items = items;
		$collections.loading = false;
	}

	// allows to temporarily lock the click on collections
	// this is used so people don't click everywhere and kill opensea api calls
	async function lock() {
		locked = true;
		await sleep(1000);
		locked = false;
	}

	onDestroy(() => {
		stop = true;
	});
</script>

<aside>
	<h2>Your collections</h2>

	{#if !signer}
		<p>Please connect your wallet to fetch your collection.</p>
	{:else}
		<ul class:locked>
			{#each items as collection}
				<li class:selected={$page.params.slug == collection.slug} on:click={lock}>
					<a href="/collections/{collection.slug}">{collection.name}</a>
				</li>
			{/each}
		</ul>
	{/if}
	{#if $collections.loading}
		<Loader />
	{/if}
</aside>

<style lang="postcss">
	aside {
		@apply py-4 px-2;
		position: fixed;
		left: 0;
		top: 0;
		width: 320px;
		height: 100vh;
		background-color: var(--grey);
		color: var(--light-grey);
		overflow: auto;
	}

	ul {
	}

	li {
		@apply px-2 py-1;
		background-color: transparent;
		transition: all 0.5s;
	}

	li:hover,
	li.selected {
		background-color: var(--light-grey);
		color: var(--grey);
	}

	a {
		display: block;
		text-decoration: none;
	}

	ul.locked li {
		pointer-events: none;
	}
</style>
