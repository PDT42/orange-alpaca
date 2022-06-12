<script lang="ts">
	//

	import { onMount } from "svelte";
	import * as latticeJson from "./assets/template.json";
	import Lattice from "./assets/lattice/Lattice.svelte";
	import { latticeContextStore } from "./assets/lattice/LatticeStore";

	export const name = "Orange Alpaca";

	onMount(async () => {
		latticeContextStore.parseJson(latticeJson);
	});

	//
</script>

<div class="container">
	<div class="header">
		<h1>Orange Alpaca</h1>
	</div>
	<div class="body">
		{#if $latticeContextStore.latticeParentId}
			<Lattice latticeId={$latticeContextStore.latticeParentId} />
		{/if}
	</div>
	<div class="footer" />
</div>

<style>
	.container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
	}

	.header {
		display: flex;
	}
</style>
