import { useState, useRef } from 'react';
import { uploadService } from '../services/upload.service';
import { saveJewel } from '../store/actions/jewel.actions';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service';

// הגדרת סוגי התכשיטים האפשריים במערך חיצוני לניהול קל
const JEWEL_TYPES = ["Earrings", "Necklaces", "Bracelets", "Rings", "14k Gold", "925 Silver"];

export function AdminAdd() {
    const [jewel, setJewel] = useState({
        vendor: '',
        price: '',
        fakeprice: '',
        quantity: '',
        img: '',
        imghover: '',
        imgthird: '',
        type: [], // שינוי: אתחול כמערך ריק כדי לאפשר בחירה מרובה
        designed: 'women',
        descriptionENG: '',
        descriptionHEB: ''
    });

    const imgRef = useRef(null);
    const imgHoverRef = useRef(null);
    const imgThirdRef = useRef(null);

    function handleChange({ target }) {
        const { name, value } = target;
        setJewel(prevJewel => ({ ...prevJewel, [name]: value }));
    }

    // פונקציה חדשה לטיפול בבחירה מרובה של סוגים
    function handleTypeChange({ target }) {
        const { value, checked } = target;
        setJewel(prevJewel => {
            let newTypes;
            if (checked) {
                // אם סומן - הוסף למערך
                newTypes = [...prevJewel.type, value];
            } else {
                // אם הוסר הסימון - הסר מהמערך
                newTypes = prevJewel.type.filter(type => type !== value);
            }
            return { ...prevJewel, type: newTypes };
        });
    }

    async function handleFileChange(ev, field) {
        try {
            const res = await uploadService.uploadImg(ev.target.files[0]);
            setJewel(prevJewel => ({ ...prevJewel, [field]: res.secure_url }));
        } catch (err) {
            console.error('Failed to upload image', err);
            showErrorMsg('Image upload failed');
        }
    }

    async function onAddJewel(ev) {
        ev.preventDefault();
        try {
            const savedJewel = await saveJewel(jewel);
            showSuccessMsg(`Jewel added (id: ${savedJewel._id})`);
            
            // איפוס הטופס
            setJewel({
                vendor: '',
                price: '',
                fakeprice: '',
                quantity: '',
                img: '',
                imghover: '',
                imgthird: '',
                type: [], // איפוס למערך ריק
                designed: 'women',
                descriptionENG: '',
                descriptionHEB: '',
                isSoldOut: false,
            });

            // ניקוי שדות הקבצים
            imgRef.current.value = '';
            imgHoverRef.current.value = '';
            imgThirdRef.current.value = '';
        } catch (err) {
            console.error('Cannot add jewel', err);
            showErrorMsg('Cannot add jewel');
        }
    }

    return (
        <section className="admin-add">
            <h1 className="admin-add__title">Admin Add</h1>
            <form className="admin-add__form" onSubmit={onAddJewel}>
                <label className="admin-add__label">
                    Vendor:
                    <input className="admin-add__input" type="text" name="vendor" value={jewel.vendor} onChange={handleChange} required />
                </label>
                <label className="admin-add__label">
                    Price:
                    <input className="admin-add__input" type="number" name="price" value={jewel.price} onChange={handleChange} required />
                </label>
                <label className="admin-add__label">
                    Fake Price:
                    <input className="admin-add__input" type="number" name="fakeprice" value={jewel.fakeprice} onChange={handleChange} required />
                </label>
                <label className="admin-add__label">
                    Quantity:
                    <input className="admin-add__input" type="number" name="quantity" value={jewel.quantity} onChange={handleChange} required />
                </label>
                <label className="admin-add__label">
                    Image:
                    <input ref={imgRef} className="admin-add__file" type="file" onChange={(ev) => handleFileChange(ev, 'img')} />
                </label>
                <label className="admin-add__label">
                    Hover Image:
                    <input ref={imgHoverRef} className="admin-add__file" type="file" onChange={(ev) => handleFileChange(ev, 'imghover')} />
                </label>
                <label className="admin-add__label">
                    Third Image:
                    <input ref={imgThirdRef} className="admin-add__file" type="file" onChange={(ev) => handleFileChange(ev, 'imgthird')} />
                </label>

                {/* כאן בוצע השינוי מ-Select ל-Checkboxes */}
                <div className="admin-add__label">
                    <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type (Select multiple):</span>
                    <div className="checkbox-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        {JEWEL_TYPES.map(type => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    value={type}
                                    checked={jewel.type.includes(type)}
                                    onChange={handleTypeChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <label className="admin-add__label">
                    Designed for:
                    <select className="admin-add__select" name="designed" value={jewel.designed} onChange={handleChange}>
                        <option value="women">women</option>
                        <option value="men">men</option>
                    </select>
                </label>
                <label className="admin-add__label">
                    Description (English):
                    <textarea className="admin-add__textarea" name="descriptionENG" value={jewel.descriptionENG} onChange={handleChange}></textarea>
                </label>
                <label className="admin-add__label">
                    Description (Hebrew):
                    <textarea className="admin-add__textarea" name="descriptionHEB" value={jewel.descriptionHEB} onChange={handleChange}></textarea>
                </label>
                <button className="admin-add__button" type="submit">Add Jewel 𖢻</button>
            </form>
        </section>
    );
}