<script>
	export let error;
</script>

{#if error}
	<p on:click>
		<strong>An error occured!</strong><br /><br />
		{error.message ?? error.reason ?? error.error ?? error}
	</p>
{/if}

<style>
	p {
		text-align: center;
		color: red;
	}
</style>
