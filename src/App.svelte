<script lang="ts">

	import * as lattice from "./assets/template.json";
	import Lattice from "./lib/lattice/Lattice.svelte";

	export let name = "Orange Alpaca";

</script>


<div class="container">
	<div class="header">
		<h1>Orange Alpaca</h1>
	</div>
	<div class="body">
		<Lattice latticeData={lattice} />
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
