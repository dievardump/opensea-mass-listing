<script>
	import { onMount } from 'svelte';

	import '../app.postcss';

	import opensea from '$lib/stores/opensea';

	import Cart from '$lib/components/Cart.svelte';
	import Header from '$lib/components/Header.svelte';
	import CollectionList from '$lib/components/OpenSea/CollectionList.svelte';

	import analytics from '$lib/modules/analytics';
	import { connected, signerAddress } from '$lib/modules/wallet';
	import { getOpenSeaProxyRegistry } from '$lib/modules/contract';

	// Every user on OpenSea has a proxy that "manage their items for them"
	// To be able to sell an item, users need to "approve" their proxy to
	// do the transfer at the time of the sale.
	// This function get the current current user OpenSea's proxy address when the signer changes
	$: getOpenseaProxy($signerAddress);

	async function getOpenseaProxy() {
		if ($signerAddress) {
			const proxy = await getOpenSeaProxyRegistry().proxies($signerAddress);
			opensea.update((opensea) => {
				opensea.proxy = proxy;
				return opensea;
			});
		} else {
			opensea.update((opensea) => {
				opensea.proxy = null;
				return opensea;
			});
		}
	}

	onMount(() => {
		if (import.meta.env.VITE_GOOGLE_ANALYTICS) {
			analytics(import.meta.env.VITE_GOOGLE_ANALYTICS);
		}
	});
</script>

<CollectionList signer={$signerAddress} />
<main>
	<Header />
	<div class="main__content">
		<slot />
	</div>
</main>
{#if $connected}
	<Cart />
{/if}

<style lang="postcss">
	main {
		padding-left: 320px;
		width: 100%;
		min-height: 100%;
		position: relative;
		z-index: 0;
	}

	.main__content {
		@apply p-4;
	}
</style>
