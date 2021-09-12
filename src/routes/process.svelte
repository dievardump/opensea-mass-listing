<script>
	import Button from '$lib/components/Button.svelte';

	import ErrorComponent from '$lib/components/ErrorComponent.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import HorizontalCard from '$lib/components/OpenSea/HorizontalCard.svelte';
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

	let listingType = 'same-pricing';

	let individualPricings = {};
	let individualExpireHours = {};

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

	async function signAllWithSamePricing() {
		signing = true;

		let expirationTime;
		if (expireHours > 0) {
			expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * expireHours);
		}

		try {
			signCounter = 1;
			for (const item of $cart) {
				await doSignOrder(item, price, expirationTime);

				signCounter++;
			}
		} catch (e) {
			console.log(e);
			error = e;
		}

		signing = false;
	}

	async function signAllWithIndividualPricing() {
		for (const item of $cart) {
			if (
				isNaN(individualPricings[item.id.toString()]) ||
				!individualPricings[item.id.toString()]
			) {
				if (
					!confirm(
						`Price for item ${item.name} is "${
							individualPricings[item.id.toString()]
						}" which seems to be invalid. Are you sure to want to continue?`,
					)
				) {
				}
			}
		}

		signing = true;
		try {
			signCounter = 1;
			for (const item of $cart) {
				let expirationTime;
				if (individualExpireHours[item.id.toString()] > 0) {
					expirationTime = Math.round(
						Date.now() / 1000 + 60 * 60 * individualExpireHours[item.id.toString()],
					);
				}

				let price = individualPricings[item.id.toString()];

				await doSignOrder(item, price, expirationTime);

				signCounter++;
			}
		} catch (e) {
			console.log(e);
			error = e;
		}

		signing = false;
	}

	async function doSignOrder(item, price, expirationTime) {
		// console.log(`${item.name} for ${price} eth expiration: ${expirationTime}`);

		return await seaportSDK.getSeaPort().createSellOrder({
			asset: {
				tokenId: item.token_id,
				tokenAddress: item.asset_contract.address,
				schemaName: item.asset_contract.schema_name,
			},
			startAmount: price,
			endAmount: price,
			accountAddress: $signerAddress,
			expirationTime,
		});
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
				<h3>Chose your listing type:</h3>
				<div class="listing-type">
					<label>
						<input type="radio" bind:group={listingType} value="same-pricing" />
						<span class="radio-fake"> Same price listings </span>
					</label>
					<label>
						<input type="radio" bind:group={listingType} value="individual-pricing" />
						<span class="radio-fake"> Individual price listings </span>
					</label>
				</div>
				{#if listingType == 'same-pricing'}
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
							<strong>Expiration in hours (0 == infinite)</strong>
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
									on:click={signAllWithSamePricing}>Ready to sign {$cart.length} orders</Button
								>
							{/if}
						</div>
					</form>
				{:else if listingType == 'individual-pricing'}
					<form on:submit|preventDefault>
						{#each $cart as item}
							<div class="selected__item">
								<div class="selected__item__card">
									<HorizontalCard {item} removable={true} />
								</div>
								<div class="selected__item__pricing">
									<label>
										<strong>Price (in ETH)</strong>
										<input
											type="number"
											bind:value={individualPricings[item.id.toString()]}
											min="0"
											step="0.01"
											placeholder="Price you want per item"
										/>
									</label>
									<label>
										<strong>Expiration in hours (0 == infinite)</strong>
										<input
											type="number"
											bind:value={individualExpireHours[item.id.toString()]}
											min="0"
											step="1"
											placeholder="How many hours for this orders?"
										/>
									</label>
								</div>
							</div>
						{/each}
						<div class="buttons">
							{#if signing}
								<Loader />
								<p>Signing {signCounter} out of {$cart.length} orders</p>
							{:else}
								<Button on:click={signAllWithIndividualPricing}
									>Ready to sign {$cart.length} orders</Button
								>
							{/if}
						</div>
					</form>
				{/if}
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

	.listing-type {
		@apply flex flex-row py-2;
	}

	.listing-type input {
		display: none;
	}

	.listing-type input + .radio-fake {
		@apply py-2 px-4;
		dispaly: block;
		border: 1px solid var(--primary);
		cursor: pointer;
	}

	.listing-type input:checked + .radio-fake {
		color: var(--secondary);
		background-color: var(--primary);
	}

	form {
		@apply py-4;
		max-width: 600px;
	}

	form label {
		font-size: var(--font-small);
	}

	.buttons {
		@apply py-2;
	}

	.selected__item {
		@apply flex flex-row;
		@apply py-2;
		border-top: 1px solid var(--grey);
	}

	.selected__item__card,
	.selected__item__card {
		flex: 0 0 50%;
	}
</style>
