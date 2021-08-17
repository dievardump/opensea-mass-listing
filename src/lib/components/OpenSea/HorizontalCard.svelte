<script>
	import env from '$lib/modules/env';

	import cart from '$lib/stores/cart';
	import Button from '$lib/components/Button.svelte';

	export let item;
	export let removable;

	function onRemove(item) {
		const index = $cart.indexOf(item);
		$cart.splice(index, 1);
		$cart = $cart;
	}
</script>

<div class="horizontal-card">
	<div class="horizontal-card__image">
		<img src={item.image_preview_url} alt={item.name} />
	</div>
	<div class="horizontal-card__content">
		<a href={`${env.VITE_OPENSEA_URL}collection/${item.collection.slug}`} target="_blank"
			><span>{item.collection.name}</span></a
		>
		<a href={item.permalink} target="_blank"><strong>{item.name}</strong></a>
		<div class="action">
			{#if removable}
				<Button on:click={() => onRemove(item)}>Unselect</Button>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	button {
		@apply flex flex-row items-center;
		text-decoration: underline;
	}

	.horizontal-card {
		@apply flex flex-row p-2 gap-2 items-center;
		border-bottom: 1px solid var(--light-grey);
		font-size: var(--font-small);
	}

	.horizontal-card__image {
		width: 64px;
		height: 64px;
		flex: 0 0 64px;
	}

	.horizontal-card__content {
		@apply flex flex-col gap-0.5;
	}
</style>
