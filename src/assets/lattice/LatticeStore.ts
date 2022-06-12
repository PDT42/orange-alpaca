import { writable, derived, Writable } from "svelte/store";

export interface ILatticeJson {
    id: string;
    width?: number;
    title?: string;
    content: (ILatticeJson | ILatticeJson[])[];
    properties?: object;
}

export interface ILocalLatticeContext {
    latticeParentId: string;
    latticeStores: Map<string, SvelteStore<any>>;
}

export interface ILatticeStoreObject {
    id: string;
    width: number;
    title?: string;
    contentReferences: (string | string[])[];
    properties?: object;
}

function extractContentReferences(
    content: (ILatticeJson | ILatticeJson[])[]
): (string | string[])[] {
    return content.map((contentElement: ILatticeJson | ILatticeJson[]) => {
        if (Array.isArray(contentElement)) {
            return contentElement.map((rowElement: ILatticeJson) => {
                return rowElement.id;
            });
        } else return contentElement.id;
    });
}

function createLatticeStore(latticeJson: ILatticeJson) {
    let initialStoreObject: ILatticeStoreObject = {
        id: latticeJson.id,
        width: latticeJson.width ? latticeJson.width : 1,
        title: latticeJson.title,
        contentReferences: extractContentReferences(latticeJson.content),
        properties: latticeJson.properties,
    };

    const {subscribe, update, set} = writable(initialStoreObject);

    return {
        subscribe, 
        set,
        put: (key, value) => update((lattice) => Object.assign({}, lattice, { [key]: value }))
    };
}

function extractLatticeStoreObjects(latticeJson: ILatticeJson): [string, any][] {
    return [[latticeJson.id, createLatticeStore(latticeJson)], ...latticeJson.content.flatMap((contentElement) => {
        if (Array.isArray(contentElement)) {
            return contentElement.flatMap((rowElement) => extractLatticeStoreObjects(rowElement));
        } else return extractLatticeStoreObjects(contentElement);
    })]
}

function extractInitialContext(latticeJson: ILatticeJson) {

    let latticeStoreMap = new Map(extractLatticeStoreObjects(latticeJson))

    return {
        latticeParentId: latticeJson.id,
        latticeStores: latticeStoreMap,
    };
}

function createLatticeContextStore() {

    console.log("Initializing LatticeContext Store.")

    const initialContext: ILocalLatticeContext = {
        latticeParentId: "",
        latticeStores: new Map()
    }

    const { subscribe, update, set } = writable(initialContext)

    return {
        subscribe,
        parseJson: (latticeJson: ILatticeJson) => { set(extractInitialContext(latticeJson)) },
        put: (key, value) => update((currentContext) => Object.assign({}, currentContext, { [key]: value }))
    }
}

export const latticeContextStore = createLatticeContextStore()