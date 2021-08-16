<script>
	import { shortenAddress } from '$lib/modules/utils';
	import { signer } from '$lib/modules/wallet';
	import OnlyConnected from './OnlyConnected.svelte';
</script>

<header>
	<div />
	<div class="wallet">
		<OnlyConnected>
			{#await $signer.getAddress() then address}
				{shortenAddress(address)}
			{/await}
		</OnlyConnected>
	</div>
</header>

<style lang="postcss">
	header {
		@apply flex flex-row justify-between p-4;
	}

	a {
		text-decoration: none;
	}

	ul {
		@apply flex flex-row;
	}

	li {
		@apply px-4;
	}
</style>
