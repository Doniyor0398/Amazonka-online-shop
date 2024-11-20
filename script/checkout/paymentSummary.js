import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";

import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
    let priceProduct = 0;
    let shippingProduct = 0;
    let cartQuantity = calculateCartQuantity();

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);

        const deliveryOptions = getDeliveryOption(cartItem.deliveryOptionsId);

        priceProduct += product.priceCents * cartItem.quantity;
        shippingProduct += deliveryOptions.priceCents;
    });
    const totalPriceProduct = priceProduct + shippingProduct;
    const taxPrice = totalPriceProduct * 0.1;
    const totalBeforeTax = totalPriceProduct + taxPrice;

    const paymentOrderHTML = `
        <div class="payment-summary-title">Order Summary</div>
        <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
                priceProduct
            )}</div>
        </div>
        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
                shippingProduct
            )}</div>
        </div>
        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
                totalPriceProduct
            )}</div>
        </div>
        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
                taxPrice
            )}</div>
        </div>
        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
                totalBeforeTax
            )}</div>
        </div>
        <button class="place-order-button button-primary">
            Place your order
        </button>
`;
    document.querySelector(".js-payment-summary").innerHTML = paymentOrderHTML;
}
