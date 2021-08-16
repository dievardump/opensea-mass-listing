import { getSigner } from './wallet';
import abis from '$lib/data/abis';
import env from '$lib/modules/env';

export function getOpenSeaProxyRegistry() {
	return new ethers.Contract(env.VITE_OPENSEA_PROXY_REGISTRY, abis.WyvernProxy, getSigner());
}

export async function isOperatorApproved(owner, operator, contractAddress) {
	const contract = new ethers.Contract(contractAddress, abis.Approval, getSigner());

	return await contract.isApprovedForAll(owner, operator);
}

export async function approveOperator(operator, contractAddress) {
	const contract = new ethers.Contract(contractAddress, abis.Approval, getSigner());

	return await contract.setApprovalForAll(operator, true);
}

export async function unapproveOperator(operator, contractAddress) {
	const contract = new ethers.Contract(contractAddress, abis.Approval, getSigner());

	return await contract.setApprovalForAll(operator, false);
}
