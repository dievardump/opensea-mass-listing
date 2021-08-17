<script>
	export let collection;
</script>

<ul class="stats">
	<li>
		<strong>Floor</strong>
		<span>{collection.stats.floor_price}</span>
	</li>
	<li>
		<strong>Owners </strong>
		<span>{collection.stats.num_owners}</span>
	</li>
	<li>
		<strong>Supply </strong>
		<span>{collection.stats.total_supply}</span>
	</li>
</ul>

<style lang="postcss">
	.stats {
		@apply flex flex-row;
		border: 1px solid var(--primary);
		border-radius: 10px;
	}

	.stats li {
		@apply py-2 px-4 flex flex-col items-center gap-0.5;
	}

	.stats li + li {
		border-left: 1px solid var(--primary);
	}
</style>
