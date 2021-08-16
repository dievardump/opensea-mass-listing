<script>
	export let text = '';

	export let size = 80;
</script>

<div class="loading__wrapper">
	<div class="lds-ring" style={`width: ${size}px; height:${size}px`}>
		<span style={`border-width: ${Math.max(1, ~~(size / 10))}px;`} />
		<span style={`border-width: ${Math.max(1, ~~(size / 10))}px;`} />
		<span style={`border-width: ${Math.max(1, ~~(size / 10))}px;`} />
		<span style={`border-width: ${Math.max(1, ~~(size / 10))}px;`} />
	</div>
	{#if text}
		<p>{text}</p>
	{/if}
</div>

<style>
	.loading__wrapper {
		text-align: center;
		width: 100%;
	}

	div {
		display: inline-block;
		position: relative;
	}
	span {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 90%;
		height: 90%;
		margin: 5%;
		border: 0 solid var(--primary);
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: var(--primary) transparent transparent transparent;
	}

	span:nth-child(1) {
		animation-delay: -0.45s;
	}
	span:nth-child(2) {
		animation-delay: -0.3s;
	}
	span:nth-child(3) {
		animation-delay: -0.15s;
	}

	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
