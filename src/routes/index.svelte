<script>
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
</script>

<section class="content">
	<h1>OpenSea Mass Listing</h1>
	<OnlyConnected>
		<p slot="not-connected-message">Please connect your wallet to access the features.</p>
		<p>
			Browse your collections using the left sidebar, and select the items you would like to list.
		</p>
	</OnlyConnected>
</section>

<style lang="postcss">
	.content {
		@apply mx-auto py-8;
		width: calc(100% - 4em);
		max-width: 680px;
	}

	p {
		text-align: center;
	}
</style>
