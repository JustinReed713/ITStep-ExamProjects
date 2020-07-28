/*import { setFullModel } from './actions/actionsModelStore.js' */

const initialState = {
    model: [],
    userName: "",
    cart: []
};

export default function storeApp(state = initialState, action) {

    switch (action.type) {
        case "SET_MODEL":
            return {
                ...state, model: [...action.payloads]
            }

        case "ADD_ITEM":
            return {
                ...state, model: [...state.model, action.payloads]
            }

        case "SET_USER":
            return {
                ...state, userName: action.payloads
            }

        case "SET_CART":
            return {
                ...state, cart: action.payloads
            }

        case "ADD_TO_CART":
            return {
                ...state, cart: [...state.cart, action.payloads]
            }

        default:
            return state
    }
}