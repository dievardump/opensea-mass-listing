<script>
	import { page } from '$app/stores';
	import env from '$lib/modules/env';

	import cart from '$lib/stores/cart';
	import Button from './Button.svelte';
	import HorizontalCard from './OpenSea/HorizontalCard.svelte';
	import ArrowDown from './SVGs/ArrowDown.svelte';
	import ArrowUp from './SVGs/ArrowUp.svelte';

	let open;
</script>

<section class="cart">
	<div />
	{#if $cart.length > 0 && $page.url.pathname !== '/process'}
		<Button href="/process">Go to listing process</Button>
	{/if}

	{#if $cart.length == 0}
		<strong>No items selected yet.</strong>
	{:else}
		<button on:click={() => (open = !open)}>
			<span> {$cart.length} item(s) selected.</span>
			<div class="arrow">
				{#if open}
					<ArrowDown />
				{:else}
					<ArrowUp />
				{/if}
			</div>
		</button>
	{/if}
</section>
{#if open}
	<section class="quicklist">
		{#each $cart as item}
			<HorizontalCard {item} removable={true} />
		{/each}
	</section>
{/if}

<style lang="postcss">
	.cart {
		@apply flex flex-row justify-between items-center px-4;
		height: 45px;
		position: fixed;
		bottom: 0;
		left: 320px;
		width: calc(100% - 320px);
		background-color: var(--whitey);
		text-align: center;
		box-shadow: 5px 0 5px 5px rgba(0, 0, 0, 0.3);
	}

	button {
		@apply flex flex-row items-center;
		text-decoration: underline;
	}

	.arrow {
		width: 20px;
		height: auto;
	}

	.quicklist {
		position: fixed;
		bottom: 45px;
		right: 0;
		left: auto;
		width: 320px;
		height: calc(100vh - 45px);
		overflow: auto;
		background-color: var(--whitey);
		box-shadow: 5px -10px 5px 5px rgba(0, 0, 0, 0.3);
	}

	.quicklist__item {
		@apply flex flex-row p-2 gap-2 items-center;
		border-bottom: 1px solid var(--light-grey);
		font-size: var(--font-small);
	}

	.quicklist__item__image {
		width: 64px;
		height: 64px;
		flex: 0 0 64px;
	}

	.quicklist__item__content {
		@apply flex flex-col gap-0.5;
	}
</style>
