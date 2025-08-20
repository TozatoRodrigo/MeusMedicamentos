import React from 'react'
import CheckoutForm from './CheckoutForm'

const PaymentForm = ({ onPaymentSuccess, onPaymentError, customerEmail, amount }) => {
  return (
    <CheckoutForm
      onPaymentSuccess={onPaymentSuccess}
      onPaymentError={onPaymentError}
      customerEmail={customerEmail}
      amount={amount}
    />
  )
}

export default PaymentForm