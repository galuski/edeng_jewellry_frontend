import { combineReducers, compose, legacy_createStore as createStore } from "redux"
import { userService } from "../services/user.service.js"
import { jewelReducer } from "./reducers/jewel.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"
import { systemReducer } from "./reducers/system.reducer.js"



const rootReducer = combineReducers({
    jewelModule: jewelReducer,
    userModule: userReducer,
    systemModule: systemReducer
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

// console.log('store.getState():', store.getState())
window.gStore = store


// store.subscribe(() => {
//     console.log('Current state is:', store.getState())
// })

