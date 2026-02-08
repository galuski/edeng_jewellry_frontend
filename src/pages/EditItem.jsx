import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveJewel } from "../store/actions/jewel.actions";
import { jewelService } from "../services/jewel.service";
import { uploadService } from "../services/upload.service";

// הגדרת סוגי התכשיטים (זהה למה שהגדרנו ב-AdminAdd)
const JEWEL_TYPES = ["Earrings", "Necklaces", "Bracelets", "Rings", "14k Gold", "925 Silver"];

const EditItem = () => {
    const { jewelId } = useParams();
    const navigate = useNavigate();
    
    const [jewel, setJewel] = useState({
        price: "",
        fakeprice: '',
        quantity: '',
        img: "",
        imghover: "",
        imgthird: "",
        vendor: "",
        descriptionENG: "",
        descriptionHEB: "",
        type: [], // אתחול כמערך ריק
        designed: "women",
        isSoldOut: false,
    });

    useEffect(() => {
        if (jewelId) {
            jewelService.getById(jewelId)
                .then((jewelData) => {
                    // נרמול נתונים: טיפול במקרים של מוצרים ישנים
                    // אם הסוג הוא מחרוזת (ישן), נהפוך אותו למערך
                    if (jewelData.type && !Array.isArray(jewelData.type)) {
                        jewelData.type = [jewelData.type];
                    }
                    // אם אין סוג בכלל, נאתחל כמערך ריק
                    if (!jewelData.type) {
                        jewelData.type = [];
                    }
                    setJewel(jewelData);
                })
                .catch((err) => console.error("Error loading jewel:", err));
        }
    }, [jewelId]);

    const handleChange = (ev) => {
        const { name, value, type, checked } = ev.target;
        setJewel((prevJewel) => ({
            ...prevJewel,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // פונקציה לניהול בחירה מרובה של סוגים
    const handleTypeChange = ({ target }) => {
        const { value, checked } = target;
        setJewel(prevJewel => {
            // יצירת עותק של המערך הקיים (או מערך ריק אם לא קיים)
            let newTypes = Array.isArray(prevJewel.type) ? [...prevJewel.type] : [];
            
            if (checked) {
                // הוספה אם סומן
                newTypes.push(value);
            } else {
                // הסרה אם הסימון בוטל
                newTypes = newTypes.filter(type => type !== value);
            }
            return { ...prevJewel, type: newTypes };
        });
    };

    const handleFileChange = async (ev, fieldName) => {
        const file = ev.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setJewel((prevJewel) => ({
                ...prevJewel,
                [fieldName]: e.target.result, // תצוגה מקדימה
            }));
        };
        reader.readAsDataURL(file);

        try {
            const uploadedImg = await uploadService.uploadImg(file);
            setJewel((prevJewel) => ({
                ...prevJewel,
                [fieldName]: uploadedImg.secure_url, // שמירת כתובת התמונה
            }));
        } catch (err) {
            console.error(`Error uploading ${fieldName}:`, err);
        }
    };

    const onSaveJewel = async (ev) => {
        ev.preventDefault();
        try {
            await saveJewel(jewel);
            navigate("/login/admin-settings/list");
        } catch (err) {
            console.error("Error saving jewel:", err);
        }
    };

    return (
        <section className="edit-item">
            <h2>{jewelId ? "Edit Jewel" : "Add Jewel"}</h2>
            <form onSubmit={onSaveJewel}>
                <label>
                    Vendor:
                    <input type="text" name="vendor" value={jewel.vendor} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={jewel.price} onChange={handleChange} required />
                </label>
                <label>
                    Fake Price:
                    <input type="number" name="fakeprice" value={jewel.fakeprice} onChange={handleChange} required />
                </label>
                <label>
                    Quantity:
                    <input type="number" name="quantity" value={jewel.quantity} onChange={handleChange} required />
                </label>
                <label>
                    Main Image:
                    {jewel.img && <img src={jewel.img} alt="Main preview" className="image-preview" />}
                    <input type="file" accept="image/*" onChange={(ev) => handleFileChange(ev, "img")} />
                </label>

                <label>
                    Hover Image:
                    {jewel.imghover && <img src={jewel.imghover} alt="Hover preview" className="image-preview" />}
                    <input type="file" accept="image/*" onChange={(ev) => handleFileChange(ev, "imghover")} />
                </label>
                <label>
                    Third Image:
                    {jewel.imgthird && <img src={jewel.imgthird} alt="Third preview" className="image-preview" />}
                    <input type="file" accept="image/*" onChange={(ev) => handleFileChange(ev, "imgthird")} />
                </label>
                <label>
                    Description (English):
                    <textarea name="descriptionENG" value={jewel.descriptionENG} onChange={handleChange} />
                </label>

                <label>
                    Description (Hebrew):
                    <textarea name="descriptionHEB" value={jewel.descriptionHEB} onChange={handleChange} dir="rtl" />
                </label>

                {/* החלק המעודכן לבחירת סוגים מרובים */}
                <div style={{ margin: '15px 0' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type (Select multiple):</label>
                    <div className="checkbox-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {JEWEL_TYPES.map(type => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: '#f5f5f5', padding: '5px 10px', borderRadius: '4px' }}>
                                <input
                                    type="checkbox"
                                    value={type}
                                    checked={jewel.type && jewel.type.includes(type)}
                                    onChange={handleTypeChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <label>
                    Designed for:
                    <select name="designed" value={jewel.designed} onChange={handleChange}>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                    </select>
                </label>
                <label>
                    Sold Out:
                    <input type="checkbox" name="isSoldOut" checked={jewel.isSoldOut} onChange={handleChange} />
                </label>

                <button className="admin-add__button" type="submit">Save</button>
            </form>
        </section>
    );
};

export default EditItem;