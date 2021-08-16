<script>
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import CollectionItems from '$lib/components/OpenSea/CollectionItems.svelte';
	import collections from '$lib/stores/collections';

	let selected = null;

	// when slug or collection changes
	$: manageSlug($page.params.slug, $collections);

	//
	async function manageSlug() {
		selected = $collections.items.find((item) => item.slug === $page.params.slug);
	}
</script>

<OnlyConnected>
	{#if selected}
		<CollectionItems collection={selected} />
	{:else if $collections.loading}
		<p>Still loading your collections.</p>
		<Loader />
	{:else}
		<p>You do not appear to hold items of this collection in your wallet.</p>
	{/if}
</OnlyConnected>
