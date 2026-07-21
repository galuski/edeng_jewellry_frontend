import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { httpService } from '../services/http.service.js'; 

// ✅ הוספנו את currency לפרופס
const PayPalCheckoutButton = ({ validateForm, payerDetails, amount, currency, cartItems, onPaymentSuccess }) => {

    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: currency || "USD", // 👈 כאן זה מתעדכן דינמית לפי מה שהלקוחה בחרה
        intent: "capture",
    };

    const handleCreateOrder = async () => {
        try {
            const data = await httpService.post("paypal/create-order", {
                amount: amount,
                currency: currency, // 👈 חשוב מאוד! שולחים את המטבע לשרת כדי שייצור את ההזמנה במטבע הנכון
                cart: cartItems,
                payer: payerDetails
            });
            
            if (data.id) {
                return data.id; 
            } else {
                console.error("No order ID returned from backend");
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const handleApprove = async (data, actions) => {
        try {
            const orderData = await httpService.post(`paypal/${data.orderID}/capture`);
            
            if (orderData.status === 'COMPLETED') {
                if (onPaymentSuccess) {
                    onPaymentSuccess(orderData.id);
                }
            } else {
                alert("Payment was not completed successfully.");
            }
            
        } catch (error) {
            console.error("Error capturing order:", error);
            alert("An error occurred while processing your payment.");
        }
    };

    return (
        // הוספנו key שמכריח את ה-Provider להתעדכן אם המטבע משתנה
        <PayPalScriptProvider options={initialOptions} key={currency}>
            <div style={{ width: "100%" }}>
                <PayPalButtons 
                    // 👈 forceReRender מבטיח שאם הסכום או המטבע משתנים, פייפאל מצייר את הכפתור מחדש עם הנתונים המעודכנים
                    forceReRender={[amount, currency]} 
                    
                    onClick={(data, actions) => {
                        const isFormValid = validateForm();
                        if (!isFormValid) {
                            return actions.reject();
                        }
                        return actions.resolve();
                    }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalCheckoutButton;