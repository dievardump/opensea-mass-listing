<script>
	export let disabled;
	export let reversed;

	export let href;
</script>

{#if !href}
	<button class="button" on:click {disabled} class:reversed>
		<slot />
	</button>
{:else}
	<a class="button" {href} on:click {disabled} class:reversed>
		<slot />
	</a>
{/if}

<style lang="postcss">
	.button {
		@apply py-2 px-8;
		background-color: var(--primary);
		color: var(--secondary);
		text-decoration: none;
	}

	.button[disabled] {
		pointer-events: none;
		opacity: 0.5;
	}

	.button.reversed {
		background-color: var(--whitey);
		color: var(--primary);
		border: 1px solid var(--primary);
	}
</style>
