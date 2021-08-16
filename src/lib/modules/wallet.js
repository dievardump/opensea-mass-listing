import { get, writable } from 'svelte/store';
import { connectWallet } from './provider';

export const ethereumProvider = writable(null);
export const signer = writable(null);
export const signerAddress = writable(null);
export const provider = writable(null);
export const chainId = writable(null);
export const connected = writable(false);

ethereumProvider.subscribe((value) => {
	if (value) {
		value.on('accountsChanged', handleAccountsChanged);
		value.on('chainChanged', handleChainChanged);
	}
});

signer.subscribe((value) => {
	if (value) {
		connected.set(true);
	} else {
		connected.set(false);
	}
});

export async function connect() {
	const instances = await connectWallet();
	provider.set(instances.provider);
	ethereumProvider.set(instances.ethereumProvider);

	handleChainChanged(instances.ethereumProvider.chainId);
	handleAccountsChanged();
}

// on account change
async function handleAccountsChanged() {
	const _signer = getProvider().getSigner();
	signer.set(_signer);

	// get current signer address.
	if (_signer) {
		signerAddress.set(await _signer.getAddress());
	} else {
		// null if disconnected
		signerAddress.set(null);
	}
}

function handleChainChanged(_chainId) {
	chainId.set(_chainId);
}

export function getSigner() {
	return get(signer);
}


export function getSignerAddress() {
	return get(signerAddress);
}

export function getEthereumProvider() {
	return get(ethereumProvider);
}

export function getProvider() {
	return get(provider);
}
