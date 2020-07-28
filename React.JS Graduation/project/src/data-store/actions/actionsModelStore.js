export function setModel(array) {
    return {
        type: "SET_MODEL",
        payloads: array
    }
};

export function addItem(item) {
    return {
        type: "ADD_ITEM",
        payloads: item
    }
};

export function setUser(string) {
    return {
        type: "SET_USER",
        payloads: string
    }
};

export function setCart(array) {
    return {
        type: "SET_CART",
        payloads: array
    }
};

export function addToCart(object) {
    return {
        type: "ADD_TO_CART",
        payloads: object
    }
};