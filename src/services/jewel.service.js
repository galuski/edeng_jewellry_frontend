
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'jewel/'
const STORAGE_KEY = 'jewelDB'

export const jewelService = {
    query,
    getById,
    save,
    remove,
    getEmptyJewel,
    getDefaultFilter
}

function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
    // .then(jewelry => {
    //     return jewelry.filter(jewel =>
    //         regExp.test(jewel.title) &&
    //         jewel.price <= filterBy.maxPrice
    //     )
    // })
}

function getById(jewelId) {
    return httpService.get(BASE_URL + jewelId)
}

function remove(jewelId) {
    // return Promise.reject('Oh no!')
    return httpService.delete(BASE_URL + jewelId)
}

function save(jewel) {
    if (jewel._id) {
        return httpService.put(BASE_URL, jewel)
    } else {
        return httpService.post(BASE_URL, jewel)
    }
}

function getEmptyJewel(name = '', price = 0, quantity = 0, fakeprice = 0, img = '', imghover = '', imgthird= '' , type, designed, isSoldOut, descriptionENG = '', descriptionHEB = '') {
    return {
        vendor: name || 'Susita-' + (Date.now() % 1000),
        price: price || utilService.getRandomIntInclusive(1000, 9000),
        fakeprice: fakeprice || utilService.getRandomIntInclusive(1000, 9000),
        quantity: quantity || utilService.getRandomIntInclusive(1000, 9000),
        img: img || '',
        imghover: imghover || '',
        imgthird: imgthird || '',
        isSoldOut: false,
        type: type,
        designed: designed,
        descriptionENG: descriptionENG || '',
        descriptionHEB: descriptionHEB || ''
    };
}



function getDefaultFilter() {
    return { txt: '', maxPrice: '', designed: '', type: '' }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 6', price: 980}).then(x => console.log(x))


