
import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'


const BASE_URL = 'auth/'
const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'



export const userService = {
    login,
    logout,
    signup,
    getById,
    getLoggedinUser
}

window.us = userService

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return httpService.post(BASE_URL + 'login', { username, password })
        .then(user => {
            if (user) return _setLoggedinUser(user)
        })
}

function signup({ username, password, fullname }) {
    return Promise.reject('Signup is disabled')
    // const user = { username, password, fullname }
    // return httpService.post(BASE_URL + 'signup', user)
    //     .then(user => {
    //         if (user) return _setLoggedinUser(user)
    //     })

}

function logout() {
    return httpService.post(BASE_URL + 'logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
        })
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

// Test Data
// userService.signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// userService.login({username: 'muki', password: 'muki1'})



