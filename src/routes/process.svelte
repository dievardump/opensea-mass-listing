<script>
	import Button from '$lib/components/Button.svelte';

	import ErrorComponent from '$lib/components/ErrorComponent.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import { approveOperator, isOperatorApproved } from '$lib/modules/contract';
	import { signerAddress } from '$lib/modules/wallet';

	import cart from '$lib/stores/cart';
	import opensea from '$lib/stores/opensea';
	import { onMount } from 'svelte';

	let seaportSDK;

	let loading;
	let approving;
	let error;

	let contracts = [];
	let notApproved = [];

	let price = 0;
	let expireHours = 0;

	let signing;

	let signCounter = 0;

	$: getAllInfo($cart);

	async function getAllInfo() {
		loading = true;

		notApproved = [];
		const shouldApprove = [];
		for (let item of $cart) {
			const contract = item.asset_contract.address;

			if (contracts.indexOf(contract) === -1) {
				contracts.push(contract);
			}

			const alreadyApproved = $opensea.approved.indexOf(contract);
			if (alreadyApproved === -1 && shouldApprove.indexOf(contract) === -1) {
				const isApproved = await isOperatorApproved($signerAddress, $opensea.proxy, contract);
				if (isApproved) {
					$opensea.approved.push(contract);
				} else {
					shouldApprove.push(contract);
					notApproved.push(item);
				}
			}
		}

		notApproved = notApproved;
		contracts = contracts;

		loading = false;
	}

	// approved User's opensea proxy to manage assets on item's contract
	async function onApprove(item) {
		error = null;
		approving = item;

		console.log(item.asset_contract.address);
		try {
			await approveOperator($opensea.proxy, item.asset_contract.address).then((tx) => tx.wait());

			$opensea.approved.push(item.asset_contract.address);

			notApproved.splice(notApproved.indexOf(item), 1);
			notApproved = notApproved;
		} catch (e) {
			error = e;
		}
		approving = false;
	}

	async function signAll() {
		signing = true;
		const seaport = seaportSDK.getSeaPort();
		// const amount = ethers.utils.parseEther(price.toString());

		let expirationTime;
		if (expireHours > 0) {
			expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * expireHours);
		}

		try {
			signCounter = 1;
			for (const item of $cart) {
				const unsignedOrder = await seaport.createSellOrder({
					asset: {
						tokenId: item.token_id,
						tokenAddress: item.asset_contract.address,
					},
					startAmount: price,
					endAmount: price,
					accountAddress: $signerAddress,
					expirationTime,
				});

				signCounter++;
			}
		} catch (e) {
			console.log(e);
			error = e;
		}

		signing = false;
	}

	onMount(async () => {
		// keccak@3.0.1 has a bug => https://github.com/cryptocoinjs/keccak/pull/22
		// which make opensea-js break with Vite
		// so I had to export opensea-js into a standalone library, with webpack
		// the library is added window in app.html
		// so now I need to load it async after "onMount" because of ssr
		seaportSDK = await import('$lib/modules/opensea-port').then((res) => res);
	});
</script>

<OnlyConnected>
	<h1>Process selection</h1>
	<p class="headline">You have selected {$cart.length} item(s).</p>
	<ErrorComponent {error} />
	{#if $cart.length}
		<section>
			<h2>Contracts</h2>
			<p>Those items live on {contracts.length} different contract(s).</p>
			{#if loading}
				<Loader />
			{:else if notApproved.length}
				<p>
					To be able to sell items on OpenSea, users need to approve OpenSea's contract to "manage
					items".<br /> This is done by calling a function called <em>set Approval For All</em> on the
					contract where the items live.
				</p>
				<p>
					<em>set Approval For All</em> name can be misleading, and I know users have been confused
					so I need to mention this:<br />
					<strong
						><em
							>it only authorizes OpenSea to manage all items of this contract, not all your NFTs</em
						></strong
					>
				</p>
				<p>
					In your current selection, {notApproved.length} contract(s) require that you approve sales
					on OpenSea.
				</p>
				<ul class="approvals-required">
					{#each notApproved as itemWithUnapproved}
						<li class="approvals-required__item">
							{#if approving == itemWithUnapproved}
								<div class="loader-wrapper">
									<Loader size={24} />
								</div>
							{:else}
								<Button disabled={approving} on:click={() => onApprove(itemWithUnapproved)}
									>Approve OpenSea</Button
								>
							{/if} for collection
							<strong
								><em>
									{itemWithUnapproved.collection.name}
								</em></strong
							>
						</li>
					{/each}
				</ul>
			{:else}
				<h2>Listing</h2>
				<p>All items are ready for a "mass listing".</p>
				<p>you can review and remove items by clicking on the link down right the window.</p>
				<form on:submit|preventDefault>
					<label>
						<strong>Price per item (in ETH)</strong>
						<input
							type="number"
							bind:value={price}
							min="0"
							step="0.01"
							placeholder="Price you want per item"
						/>
					</label>
					<label>
						<strong>Expiration time in hours (0 == infinite)</strong>
						<input
							type="number"
							bind:value={expireHours}
							min="0"
							step="1"
							placeholder="How many hours for this orders?"
						/>
					</label>
					<div class="buttons">
						{#if signing}
							<Loader />
							<p>Signing {signCounter} out of {$cart.length} orders</p>
						{:else}
							<Button
								disabled={isNaN(price) || price <= 0 || isNaN(expireHours) || expireHours < 0}
								on:click={signAll}>Ready to sign {$cart.length} orders</Button
							>
						{/if}
					</div>
				</form>
			{/if}
		</section>
	{:else}
		<p>Please select items by browsing through your collections on the left sidebar.</p>
	{/if}
</OnlyConnected>

<style lang="postcss">
	section {
		@apply py-4;
	}

	h2:not(:first-child) {
		@apply mt-4;
	}

	.approvals-required__item {
		@apply flex flex-row items-center gap-8 py-2;
	}

	.loader-wrapper {
		width: 32px;
	}

	form {
		@apply py-4;
		max-width: 400px;
	}

	.buttons {
		@apply py-2;
	}
</style>
