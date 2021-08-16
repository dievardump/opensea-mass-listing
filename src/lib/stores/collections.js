import { writable } from "svelte/store";

const collections = writable({
	selected: null,
	items: [],
	loading: false
});

export default collections;