import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ✅ הוספנו את onPaymentSuccess לשורת הקבלה (Props)
const PayPalCheckoutButton = ({ validateForm, payerDetails, amount, cartItems, onPaymentSuccess }) => {

    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const handleCreateOrder = async () => {
        try {
            const response = await fetch("http://localhost:3030/api/paypal/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    amount: amount,
                    cart: cartItems,
                    payer: payerDetails
                }),
            });
            
            const data = await response.json();
            
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
            const response = await fetch(`http://localhost:3030/api/paypal/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const orderData = await response.json();
            
            if (orderData.status === 'COMPLETED') {
                // ✅ כאן קורה הקסם האמיתי! קוראים לפונקציה שעושה את מעבר הדף במקום ה-alert
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
        <PayPalScriptProvider options={initialOptions}>
            <div style={{ width: "100%" }}>
                <PayPalButtons 
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