import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { jewelService } from '../services/jewel.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { AdminList } from './AdminList.jsx'

export function AdminIndex() {
    const dispatch = useDispatch()
    const [jewelry, setJewelry] = useState([])

    useEffect(() => {
        async function fetchJewelry() {
            try {
                const jewelryData = await jewelService.query()
                setJewelry(jewelryData)
                dispatch({ type: 'SET_JEWELRY', jewelry: jewelryData })
            } catch (err) {
                showErrorMsg('Cannot load jewelry')
            }
        }
        fetchJewelry()
    }, [dispatch])

    async function onRemoveJewel(jewelId) {
        try {
            await jewelService.remove(jewelId)  // שליחה לשרת להסרת הפריט
            setJewelry(prevJewelry => prevJewelry.filter(jewel => jewel._id !== jewelId))
            dispatch({ type: 'REMOVE_JEWEL', jewelId })
            showSuccessMsg('Jewel removed')
        } catch (err) {
            console.log('Cannot remove jewel', err)
            showErrorMsg('Cannot remove jewel')
        }
    }

    async function onEditJewel(jewelId) {
        const price = +prompt('New price?')
    
        // שואל את המשתמש אם המוצר "Sold Out"
        const isSoldOut = window.confirm('Is the item sold out?')  // משתמש ב-`confirm` (אישור/ביטול)
    
        try {
            const jewelToUpdate = { price, isSoldOut }  // עדכון המחיר ו-`isSoldOut`
            const currentJewel = jewelry.find(jewel => jewel._id === jewelId)
            
            // שולחים את כל השדות, כולל המחיר ו-`isSoldOut`
            const updatedJewel = await jewelService.save({ ...currentJewel, ...jewelToUpdate })
            
            setJewelry(prevJewelry => prevJewelry.map(jewel => jewel._id === jewelId ? updatedJewel : jewel))
            dispatch({ type: 'UPDATE_JEWEL', jewel: updatedJewel })
            showSuccessMsg(`Jewel updated to price: $${updatedJewel.price}, Sold Out: ${updatedJewel.isSoldOut}`)
        } catch (err) {
            console.log('Cannot update jewel', err)
            showErrorMsg('Cannot update jewel')
        }
    }
        
    return (
        <AdminList 
            jewelry={jewelry} 
            onRemoveJewel={onRemoveJewel} 
            onEditJewel={onEditJewel} 
        />
    )
}