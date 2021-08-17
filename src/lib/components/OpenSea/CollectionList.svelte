<script>
	import { page } from '$app/stores';
	import { getUserCollections } from '$lib/modules/opensea';
	import { sleep } from '$lib/modules/utils';

	import collections from '$lib/stores/collections';
	import { onDestroy } from 'svelte';
	import Loader from '../Loader.svelte';
	import CollectionStats from './CollectionStats.svelte';

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
					<a href="/collections/{collection.slug}"
						>{collection.name}

						<div class="stats-wrapper">
							<img src="/images/icons/question-mark.svg" alt="Stats" />
							<div class="stats-tooltip">
								<CollectionStats {collection} />
							</div>
						</div>
					</a>
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
		z-index: 10;
	}

	ul {
	}

	li {
		@apply px-2 py-1;
		background-color: transparent;
		transition: all 0.5s;
		position: relative;
	}

	li:hover,
	li.selected {
		background-color: var(--light-grey);
		color: var(--grey);
	}

	li:hover {
		z-index: 5;
	}

	a {
		display: block;
		text-decoration: none;
	}

	ul.locked li {
		pointer-events: none;
	}

	.stats-wrapper {
		position: absolute;
		right: 0.5em;
		top: 50%;
		transform: translateY(-50%);
		width: 14px;
		height: 14px;
	}

	.stats-wrapper img {
		width: 100%;
		height: auto;
	}

	.stats-tooltip {
		display: none;
		position: absolute;
		top: calc(100% + 0.5em);
		right: 0;
		pointer-events: none;
	}

	.stats-wrapper:hover {
	}
	.stats-wrapper:hover .stats-tooltip {
		display: block;
		background-color: var(--whitey);
		border-radius: 10px;
		overflow: hidden;
	}
</style>
