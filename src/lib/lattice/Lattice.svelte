<script lang="ts" context="module">
    //
    export interface Lattice {
        id: string;
        width?: number;
        title?: string;
        content: Lattice[] | Lattice[][];
        properties?: object;
    }
</script>

<script lang="ts">
    //
    export let latticeData: Lattice;
    export let latticeLevel: number = 1;

    let id = latticeData.id;
    let width = latticeData.width ? latticeData.width : 1;
    let title = latticeData.title;
    let titleWeight = 300 + 250 / latticeLevel;
    let content = latticeData.content;
    let properties = Array.of(...Object.entries(latticeData.properties));

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

    console.log("" + id + " " + properties.length);
</script>

<div
    style="
        flex-grow: {width};
        background-color: rgba(125, 125, 125, {0 + 0.2 * latticeLevel});
    "
    class="lattice"
>
    <!-- Render Lattice title -->
    <div class="row title-row">
        {#if editModeEnabled}
            <input
                style="font-weight: {titleWeight}"
                class="title-input"
                bind:value={title}
                placeholder={title}
            />
            <button class="save-button" on:click={saveChanges}> 💾 </button>
        {:else}
            <div style="font-weight: {titleWeight}">
                {title}
            </div>
            <button class="edit-button" on:click={toggleEditMode}> 🔨 </button>
        {/if}
    </div>

    {#if editModeEnabled}
        <!-- Render Lattice Config -->
        {#if properties.length > 0}
            <div class="divider"></div>
            {#each properties as [key, value]}
                <div class="row config-row">
                    <span>{key}:</span>
                    <input class="property-input" bind:value={value} placeholder={value}>
                </div>
            {/each}
        {/if}
    {:else}
        <!-- Render Lattice content -->
        {#each content as latticeContent}
            {#if Array.isArray(latticeContent)}
                <div class="row lattice-row">
                    {#each latticeContent as rowLattice}
                        <svelte:self
                            latticeData={rowLattice}
                            latticeLevel={latticeLevel + 2}
                        />
                    {/each}
                </div>
            {:else}
                <div class="row">
                    <svelte:self
                        latticeData={latticeContent}
                        latticeLevel={latticeLevel + 1}
                    />
                </div>
            {/if}
        {/each}
    {/if}
</div>

<style>
    .lattice {
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        gap: 0.25rem;
        padding: .25rem;
    }

    .row {
        display: flex;
        flex-flow: row nowrap;

        align-items: center;
    }

    .divider {
        border-top: .1rem solid rgb(43, 43, 43);
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
