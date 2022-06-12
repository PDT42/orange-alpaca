<script lang="ts">
    //

    import { nanoid } from "nanoid";
    import {
        createLatticeStore,
        latticeContextStore,
        ILatticeJson,
    } from "./LatticeStore";

    export let latticeId: string;
    export let latticeLevel: number = 1;

    $: latticeData = $latticeContextStore.latticeStores[latticeId];
    $: latticeContentReferences = $latticeData
        ? $latticeData.contentReferences
        : new Map();
    $: latticeProperties = $latticeData
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

    function addContentElement() {
        console.log("called add lattice");

        let newLatticeId = nanoid();
        let newLatticeStoreObject: ILatticeJson = {
            id: newLatticeId,
            width: 1,
            title: "New Lattice",
            content: [],
            properties: {},
        };

        latticeContextStore.put(
            "latticeStores",
            Object.fromEntries([
                ...Object.entries($latticeContextStore.latticeStores),
                [newLatticeId, createLatticeStore(newLatticeStoreObject)],
            ])
        );

        latticeData.put("contentReferences", [
            ...$latticeData.contentReferences,
            newLatticeId,
        ]);

        console.log($latticeData);
    }

    //
</script>

{#if $latticeData}
    <div
        class="lattice"
        style="
            background-color: rgba(43, 43, 43, {0 + 0.1 * latticeLevel});
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
            <div class="lattice">
                <div class="row"><div class="divider" /></div>

                <!-- Add Content lattice button -->
                <div class="row">
                    <button
                        class="add-child-button"
                        on:click={addContentElement}
                    >
                        ➕
                    </button>
                </div>

                <div class="row"><div class="divider" /></div>

                <!-- Render Lattice Config -->
                {#if latticeProperties.length > 0}
                    <!--  -->

                    <!-- List all config properties -->
                    {#each latticeProperties as [key, value]}
                        <div class="row config-row">
                            <span>{key}</span>
                            <input
                                class="config-input"
                                bind:value={$latticeData.properties[key]}
                                placeholder={$latticeData.properties[key]}
                            />
                        </div>
                    {/each}
                {:else}
                    <span>No config properties available ...</span>
                {/if}
                <div class="row"><div class="divider" /></div>
            </div>
        {/if}

        <!-- Render Lattice content -->
        {#each latticeContentReferences as contentLatticeId}
            {#if Array.isArray(contentLatticeId)}
                <div class="row lattice-row">
                    {#each contentLatticeId as rowLatticeId}
                        <svelte:self
                            latticeId={rowLatticeId}
                            latticeLevel={latticeLevel + 2}
                        />
                    {/each}
                </div>
            {:else}
                <div class="row lattice-row">
                    <svelte:self
                        latticeId={contentLatticeId}
                        latticeLevel={latticeLevel + 1}
                    />
                </div>
            {/if}
        {/each}
    </div>
{:else}
    Lattice: {latticeId} - No data found ...
{/if}

<style>
    .lattice {
        display: flex;
        flex-flow: column nowrap;
        gap: 0.5rem;
        padding: 0.25rem;
        margin-inline: 0.25rem;
    }

    .row {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .divider {
        flex-grow: 1;
        border-top: 0.125rem solid rgb(43, 43, 43);
    }

    .title-row {
        justify-content: space-between;
    }

    .lattice-row {
        justify-content: space-around;
        align-items: start;
    }

    .config-row {
        justify-content: space-between;
    }

    .add-child-button {
        flex-grow: 1;
    }
</style>
