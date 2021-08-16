<script>
	import cart from '$lib/stores/cart';
	import Button from '../Button.svelte';

	export let item;

	$: isSelected = $cart.indexOf(item) !== -1;

	async function onAction() {
		if (isSelected) {
			const index = $cart.indexOf(item);
			$cart.splice(index, 1);
		} else {
			$cart.push(item);
		}

		$cart = $cart;
	}
</script>

<article class="items__item">
	<div class="items__item__image__wrapper">
		<div class="items__item__image"><img src={item.image_preview_url} alt={item.name} /></div>
	</div>
	<div class="items__item__name">
		<strong>
			{item.name}
		</strong>
	</div>
	<div class="actions">
		<Button reversed={isSelected} on:click={onAction}>{isSelected ? 'Unselect' : 'Select'}</Button>
	</div>
</article>

<style lang="postcss">
	.items__item {
		@apply p-2 flex flex-col gap-2;
	}

	.items__item__image__wrapper {
		width: 100%;
		position: relative;
	}

	.items__item__image__wrapper::before {
		content: '';
		display: block;
		width: 100%;
		height: 0;
		padding-top: 100%;
	}

	.items__item__image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		margin: 0 auto;
	}

	.items__item {
		border: 1px solid var(--grey);
		text-align: center;
	}
</style>
