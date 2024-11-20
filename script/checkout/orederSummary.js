import {
    cart,
    removeFromCart,
    updateQuantity,
    deliveryOption,
} from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import {
    deliveryOptions,
    getDeliveryOption,
    calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "../checkoutHeader/checkoutHeader.js";

export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        let deliveryOptionsId = cartItem.deliveryOptionsId;

        const deliveryOption = getDeliveryOption(deliveryOptionsId);

        calculateDeliveryDate(deliveryOption);

        cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${calculateDeliveryDate(deliveryOption)}
            </div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                            $${formatCurrency(matchingProduct.priceCents)}
                        </div>
                        <div class="product-quantity">
                            <span>
                            Quantity:
                                <span class="
                                quantity-label
                                js-quantity-label-${matchingProduct.id}">
                                    ${cartItem.quantity}
                                </span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-link"
                            data-product-id="${matchingProduct.id}">
                                Update
                            </span>

                            <input
                            type="number"
                            class="js-quantity-number 
                            quantity-input 
                            js-quantity-input-${matchingProduct.id}"
                            data-product-id="${matchingProduct.id}"
                            />

                            <span class="link-primary js-save-link save-quantity-link" data-product-id="${
                                matchingProduct.id
                            }">
                            Save
                            </span>
                            
                            <span class="delete-quantity-link 
                            link-primary
                            js-delete-link" 
                            data-product-id="${matchingProduct.id}">
                                Delete
                            </span>
                        </div>

                        <span class="error-in-checkout js-error-in-checkout-${
                            matchingProduct.id
                        }">Введите не меньше 0 и не больше 1000
                        </span>
                        </div>
                        <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                            ${deliveryOptionHTML(matchingProduct, cartItem)}
                        </div>
                </div>
        </div>`;
    });

    // !functin for delivery chekcout radio
    function deliveryOptionHTML(matchingProduct, cartItem) {
        let html = "";
        deliveryOptions.forEach((deliveryOption) => {
            calculateDeliveryDate(deliveryOption);

            const deliveryPriceCents =
                deliveryOption.priceCents === 0
                    ? "FREE"
                    : `${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

            html += `
                <div class="delivery-option js-delivery-option"
                data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${deliveryOption.id}"
                >
                    <input 
                    ${isChecked ? "checked" : ""}
                    type="radio" class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"/>    
                    <div>
                    <div class="delivery-option-date">${calculateDeliveryDate(
                        deliveryOption
                    )}</div>
                    <div class="delivery-option-price">$${deliveryPriceCents} Shipping</div>
                    </div>
                </div>
            `;
        });
        return html;
    }

    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    //! REMOVE product in basket
    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            /* const containerCheckoutElement = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            containerCheckoutElement.remove(); */
            updateCartQunatity();
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
    // ! UPDATE CART QUANTITY
    function updateCartQunatity() {
        renderCheckoutHeader();
    }
    updateCartQunatity();

    // !click on update
    document.querySelectorAll(".js-update-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.add("is-editing-quantity");
            const quantityInput = document.querySelector(
                `.js-quantity-input-${productId}`
            );
            quantityInput.select();
        });
    });

    // ! click on save
    document.querySelectorAll(".js-save-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            saveUpdate(productId);
        });
    });

    document.querySelectorAll(".js-quantity-number").forEach((input) => {
        input.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                const productId = input.dataset.productId;
                saveUpdate(productId);
            }
        });
    });
    // ! click on save
    function saveUpdate(productId) {
        const container = document.querySelector(
            `.js-cart-item-container-${productId}`
        );
        container.classList.remove("is-editing-quantity");

        const quantityInput = document.querySelector(
            `.js-quantity-input-${productId}`
        );
        const newQuantity = parseInt(quantityInput.value);

        const inputLabel = document.querySelector(
            `.js-quantity-label-${productId}`
        );

        if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity >= 1000) {
            container.classList.add("is-js-save-eror");
            return;
        } else {
            container.classList.remove("is-js-save-eror");
        }
        inputLabel.innerHTML = newQuantity;

        updateQuantity(productId, newQuantity);
        updateCartQunatity();
        renderPaymentSummary();
    }
    // !delivery option product
    document.querySelectorAll(".js-delivery-option").forEach((element) => {
        element.addEventListener("click", () => {
            const { productId, deliveryOptionId } = element.dataset;
            deliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}
renderOrderSummary();
