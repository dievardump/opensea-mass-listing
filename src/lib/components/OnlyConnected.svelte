<script>
	import Button from '$lib/components/Button.svelte';
	import { connect, connected } from '$lib/modules/wallet';

	async function onConnect() {
		await connect();
	}
</script>

{#if !$connected}
	<slot name="not-connected-message" />
	<div class="only-connected">
		<Button on:click={onConnect}>Connect Wallet</Button>
	</div>
{:else}
	<slot />
{/if}

<style>
	.only-connected {
		text-align: center;
	}
</style>
