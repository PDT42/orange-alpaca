<script lang="ts">
    //

    import { latticeContextStore } from "./LatticeStore";

    export let latticeId: string;
    export let latticeLevel: number = 1;

    let latticeData = $latticeContextStore.latticeStores.get(latticeId);
    let latticeContentReferences = $latticeData
        ? $latticeData.contentReferences
        : new Map();
    let latticeProperties = $latticeData
        ? Array.of(...Object.entries($latticeData.properties))
        : [];

    let titleWeight = 300 + 250 / latticeLevel;
    let editModeEnabled: boolean = false;

    function toggleEditMode() {
        if (editModeEnabled == false) {
            editModeEnabled = true;
        } else {
            console.error("Already in edit mode!");
        }
    }

    function saveChanges() {
        if (editModeEnabled == false) {
            console.error("Not in edit mode! Can't save!");
        } else {
            // TODO: POST changes
            editModeEnabled = false;
        }
    }

    //
</script>

{#if $latticeData}
    <div
        class="lattice"
        style="
            background-color: rgba(110, 110, 150, {1 - 0.2 * latticeLevel});
            flex-grow: {$latticeData.width}
    "
    >
        <!-- Render Lattice title -->
        <div class="row title-row">
            {#if editModeEnabled}
                <input
                    style="font-weight: {titleWeight}"
                    class="title-input"
                    bind:value={$latticeData.title}
                    placeholder={$latticeData.title}
                />
                <button class="save-button" on:click={saveChanges}> 💾 </button>
            {:else}
                <div style="font-weight: {titleWeight}">
                    {$latticeData.title}
                </div>
                <button class="edit-button" on:click={toggleEditMode}>
                    🔨
                </button>
            {/if}
        </div>

        {#if editModeEnabled}
            <!--  -->
            <!-- Render Lattice Config -->
            {#if latticeProperties.length > 0}
                <div class="row">
                    <div class="divider" />
                </div>
                {#each latticeProperties as [key, value]}
                    <div class="row config-row">
                        <span>{key}</span>
                        <span>{value}</span>
                    </div>
                {/each}
            {/if}
        {:else}
            <!--  -->
            <!-- Render Lattice content -->
            {#each latticeContentReferences as contentLatticeId}
                {#if Array.isArray(contentLatticeId)}
                    <div class="row">
                        {#each contentLatticeId as rowLatticeId}
                            <svelte:self
                                latticeId={rowLatticeId}
                                latticeLevel={latticeLevel + 2}
                            />
                        {/each}
                    </div>
                {:else}
                    <div class="row">
                        <svelte:self
                            latticeId={contentLatticeId}
                            latticeLevel={latticeLevel + 1}
                        />
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
{/if}

<style>
    .lattice {
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        gap: 0.25rem;
        padding: 0.25rem;
    }

    .row {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .divider {
        flex-grow: 1;
        border-top: 0.1rem solid rgb(43, 43, 43);
    }

    .title-row {
        justify-content: space-between;
    }

    .lattice-row {
        justify-content: space-around;
    }

    .config-row {
        justify-content: space-between;
    }

    .button {
        font-size: 0.8rem;
    }
</style>
