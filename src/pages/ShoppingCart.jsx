import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { ADD_JEWEL_TO_CART } from '../store/reducers/jewel.reducer.js'
import { SET_CART, REMOVE_JEWEL_FROM_CART } from '../store/reducers/jewel.reducer.js'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { utilService } from '../services/util.service.js'
import { createPayment } from '../services/ypay.service.js'
import PayPalCheckoutButton from '../cmps/PayPalCheckoutButton.jsx'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

export function ShoppingCart() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const shoppingCart = useSelector(state => state.jewelModule.shoppingCart)
    const user = userService.getLoggedinUser()

    const currency = useSelector(storeState => storeState.systemModule.currency);
    const exchangeRate = useSelector(storeState => storeState.systemModule.exchangeRate);

    const validCouponCode = "edeng10"
    const discountRate = 0.2
    const deliveryFree = 0

    const [couponInput, setCouponInput] = useState("")
    const [isCouponApplied, setIsCouponApplied] = useState(false)

    const [payerName, setPayerName] = useState("")
    const [payerEmail, setPayerEmail] = useState("")
    const [payerPhone, setPayerPhone] = useState("")
    const [payerAddress, setPayerAddress] = useState("")
    const [payerApartment, setPayerApartment] = useState("")
    const [payerPostal, setPayerPostal] = useState("")
    const [payerCity, setPayerCity] = useState("")
    const [isTermsAccepted, setIsTermsAccepted] = useState(false)

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    function isValidPhone(phone) {
        if (!phone) return false;
        return isValidPhoneNumber(phone);
    }

    function removeFromCart(jewelId) {
        dispatch({ type: REMOVE_JEWEL_FROM_CART, jewelId })
    }

    function getCartTotal() {
        return shoppingCart.reduce((acc, jewel) => acc + jewel.price, 0)
    }

    function applyCoupon() {
        if (isCouponApplied) {
            showErrorMsg(t("Coupon already applied"))
            return
        }

        if (couponInput === validCouponCode) {
            setIsCouponApplied(true)
            showSuccessMsg(t("Coupon applied successfully!"))
        } else {
            showErrorMsg(t("Invalid coupon code"))
        }
    }

    const subtotal = getCartTotal()
    const discountAmount = isCouponApplied ? subtotal * discountRate : 0
    const totalAfterDiscount = subtotal - discountAmount
    const finalTotal = totalAfterDiscount + deliveryFree
    const finalTotalInUSD = currency === 'USD' ? finalTotal : (finalTotal / exchangeRate);

    // פונקציה שבודקת אם הטופס תקין
    function validateForm() {
        if (!isTermsAccepted) {
            showErrorMsg(t("You must accept the Terms and Conditions before continuing"));
            return false;
        }
        if (!payerName || !payerEmail || !payerPhone || !payerAddress || !payerCity) {
            showErrorMsg(t("Please fill in all required fields (name, email, phone, address, city)"));
            return false;
        }
        if (!isValidEmail(payerEmail)) {
            showErrorMsg(t("Invalid email format"));
            return false;
        }
        if (!isValidPhone(payerPhone)) {
            showErrorMsg(t("Invalid phone number"));
            return false;
        }
        return true;
    }

    // ✅ פונקציה חדשה שמופעלת ברגע שפייפאל מדווח על הצלחה!
    function onPaymentSuccess(orderId) {
        // מכינים את המוצרים לשמירה בדיוק כמו ב-YPAY
        const items = shoppingCart.map(jewel => ({
            _id: jewel._id,
            price: jewel.price,
            quantity: 1,
            vatIncluded: true,
            name: jewel.vendor || "מוצר ללא שם",
            description: jewel.descriptionHEB || jewel.descriptionENG || "תכשיט",
        }))

        // שומרים ב-localStorage כדי שקומפוננטת OrderSuccess תוכל למשוך אותם ולהוריד מלאי
        localStorage.setItem("lastItems", JSON.stringify(items))
        localStorage.setItem("lastAmount", finalTotal)

        // ניווט לדף ההצלחה אחרי השהייה קצרה (שפייפאל לא יזרוק שגיאת אזהרה)
        setTimeout(() => {
            navigate('/order/success')
        }, 1500)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) return;

        try {
            const items = shoppingCart.map(jewel => ({
                _id: jewel._id,
                price: jewel.price,
                quantity: 1,
                vatIncluded: true,
                name: jewel.vendor || "מוצר ללא שם",
                description: jewel.descriptionHEB || jewel.descriptionENG || "תכשיט",
            }))

            if (deliveryFree) {
                items.push({
                    price: deliveryFree,
                    quantity: 1,
                    vatIncluded: true,
                    name: "Delivery",
                    description: "Shipping Fee",
                })
            }

            const contact = {
                name: payerName,
                email: payerEmail,
                mobile: payerPhone,
                phone: payerPhone,
                address: `${payerAddress}, Apt ${payerApartment || ''}, ${payerCity}`,
                zipcode: payerPostal || "",
                comments: `Order from Edeng_Jewellry website`,
            }

            localStorage.setItem("lastContact", JSON.stringify(contact))
            localStorage.setItem("lastItems", JSON.stringify(items))
            localStorage.setItem("lastAmount", finalTotal)

            const { url } = await createPayment({
                amount: +finalTotal.toFixed(2),
                contact,
                items,
                discount: isCouponApplied ? 10 : 0,
            })

            window.location.href = url
        } catch (err) {
            console.error("❌ Payment redirect error:", err)
            showErrorMsg(t("There was an error while redirecting to the payment page"))
        }
    }

    return (
        <section className="cart">
            {shoppingCart.length === 0 ? (
                <p className="empty-cart-msg">{t("The Cart is Empty")}</p>
            ) : (
                <>
                    <h5>{t("Your Cart")}</h5>
                    <div className="cart-items-title">
                        <p>{t("Items")}</p>
                        <p>{t("Title")}</p>
                        <p>{t("Price")}</p>
                        <p>{t("Remove")}</p>
                    </div>
                    <ul>
                        {shoppingCart.map((jewel, idx) => (
                            <li className='cart-items-title cart-items-item' key={idx}>
                                <img src={jewel.img} alt={jewel.vendor} />
                                <p>{jewel.vendor}</p>
                                <p>{utilService.getFormattedPrice(jewel.price, currency, exchangeRate)}</p>
                                <button className='remove-cart-btn' onClick={() => removeFromCart(jewel._id)}>x</button>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-bottom">
                        <div className="cart-total">
                            <h2>{t("Cart Totals")}</h2>
                            <p>{t("Subtotal")} {utilService.getFormattedPrice(subtotal, currency, exchangeRate)}</p>
                            {isCouponApplied && (
                                <p>{t("Discount (10%)")} -{utilService.getFormattedPrice(discountAmount, currency, exchangeRate)}</p>
                            )}
                            <div>
                                <p className='shopping-cart-delivery-txt'>
                                    {t("Delivery Fee")} {utilService.getFormattedPrice(deliveryFree, currency, exchangeRate)}
                                </p>
                                <p>{t("Home delivery by courier, estimated arrival time: 3–7 business days")}</p>
                            </div>
                            <b>{t("Total")} {utilService.getFormattedPrice(finalTotal, currency, exchangeRate)}</b>

                            <form className="payer-details-form" onSubmit={handleSubmit} noValidate>
                                <h2>{t("Order Form")}</h2>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            className="pay-input"
                                            value={payerName}
                                            onChange={(e) => setPayerName(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="name">{t("Full name")}</label>
                                        <span id="name-error" className="error-message" role="alert"></span>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            required
                                            className="pay-input"
                                            value={payerEmail}
                                            onChange={(e) => setPayerEmail(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="email">{t("Email address")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className={`input-data phone-field-container ${payerPhone ? 'has-value' : ''}`}>
                                        <PhoneInput
                                            international
                                            defaultCountry="IL"
                                            value={payerPhone}
                                            onChange={setPayerPhone}
                                            className="pay-input custom-phone-wrapper"
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="phone">{t("Phone number")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="text"
                                            name="address"
                                            autoComplete="address-line1"
                                            required
                                            className="pay-input"
                                            value={payerAddress}
                                            onChange={(e) => setPayerAddress(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="address">{t("Address")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="text"
                                            name="apartment"
                                            autoComplete="address-line2"
                                            className="pay-input"
                                            required
                                            value={payerApartment}
                                            onChange={(e) => setPayerApartment(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="apartment">{t("Apartment")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="text"
                                            name="postal-code"
                                            autoComplete="postal-code"
                                            required
                                            className="pay-input"
                                            value={payerPostal}
                                            onChange={(e) => setPayerPostal(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="postal-code">{t("Postal Code (optional)")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-data">
                                        <input
                                            type="text"
                                            name="city"
                                            autoComplete="address-level2"
                                            required
                                            className="pay-input"
                                            value={payerCity}
                                            onChange={(e) => setPayerCity(e.target.value)}
                                        />
                                        <div className="underline"></div>
                                        <label htmlFor="city">{t("City")}</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <label className="terms-row">
                                        <input
                                            className="input-cheakbox"
                                            type="checkbox"
                                            checked={isTermsAccepted}
                                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                        />
                                        {t("I have read and agree to the Terms and Conditions and Privacy Policy")}{" "}
                                        <a
                                            href="./../../public/תקנון אתר - edeng_jewellry.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t("Terms and Conditions & Privacy Policy")}
                                        </a>
                                    </label>
                                </div>
                                <div className='shopping-cart-buttons-area'>
                                    <button type="submit" className="cart-submit-btn">
                                        {t("PROCEED TO CHECKOUT")}
                                    </button>
                                    <PayPalCheckoutButton
                                        validateForm={validateForm}
                                        payerDetails={{
                                            payerName,
                                            payerEmail,
                                            payerPhone,
                                            payerAddress,
                                            payerApartment,
                                            payerPostal,
                                            payerCity
                                        }}
                                        amount={+finalTotalInUSD.toFixed(2)}
                                        cartItems={shoppingCart}
                                        onPaymentSuccess={onPaymentSuccess} // ✅ העברנו את הפונקציה לכפתור הפייפאל!
                                    />
                                </div>
                            </form>

                        </div>

                        <div className="cart-promocode">
                            <p>{t("If you have a promo code, Enter it here")}</p>
                            <div className="cart-promocode-input">
                                <input
                                    type="text"
                                    placeholder={t("promo code")}
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    disabled={isCouponApplied}
                                />
                                <button
                                    className={`cart-promocode-btn ${isCouponApplied ? 'applied' : ''}`}
                                    onClick={applyCoupon}
                                    disabled={isCouponApplied}
                                >
                                    {isCouponApplied ? t("Applied") : t("Submit")}
                                </button>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </section>
    )
}