let ethereumProvider = null;
let signer = null;
let provider = null;

export async function connectWallet() {
	ethereumProvider = window.ethereum;
	console.log(ethereumProvider);
	if (!ethereumProvider) {
		throw new Error('No ethereum provider.');
	}

	if ('function' === typeof ethereumProvider.enable) {
		await ethereumProvider.enable();
	}

	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	provider = new ethers.providers.Web3Provider(ethereumProvider);

	return { provider, ethereumProvider };
}
