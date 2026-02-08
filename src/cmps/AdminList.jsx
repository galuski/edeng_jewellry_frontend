import { useNavigate } from 'react-router-dom';

export function AdminList({ jewelry = [], onRemoveJewel }) {
    const navigate = useNavigate();

    return (
        <section className="admin-list">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p className="p-title">Item</p>
                    <p className="p-title">Title</p>
                    <p className="p-title">Price</p>
                    <p className="p-title">Status</p>
                    <p className="p-title">Edit</p>
                    <p className="p-title">Remove</p>
                </div>
                <br />
                <hr />
            </div>
            <ul>
                {jewelry.map((jewel, idx) => (
                    <li className='cart-items-title cart-items-item' key={idx}>
                        <img src={jewel.img} alt={jewel.vendor} />
                        <p>{jewel.vendor}</p>
                        <p>{jewel.price}</p>
                        <p>{jewel.isSoldOut ? "Sold out" : "In stock"}</p>
                        <p className="edit" onClick={() => navigate(`/edit/${jewel._id}`)}>📝</p>
                        <button className='remove-cart-btn' onClick={() => onRemoveJewel(jewel._id)}>x</button>
                    </li>
                ))}
            </ul>
        </section>
    );
}