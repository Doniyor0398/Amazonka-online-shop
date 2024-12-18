export let cart;

loadFromStorage();

export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart) {
        cart = [
            {
                productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                quantity: 1,
                deliveryOptionsId: "1",
            },
            {
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity: 2,
                deliveryOptionsId: "2",
            },
        ];
    }
}

export function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
    let matchingCartItem;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingCartItem = cartItem;
        }
    });

    if (matchingCartItem) {
        matchingCartItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            deliveryOptionsId: "1",
        });
    }
    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}

// !function cart update quantity cart
export function updateQuantity(productId, newQuantity) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });
    matchingItem.quantity = newQuantity;

    saveToStorage();
}

// !for delivery Option function
export function deliveryOption(productId, deliveryOptionId) {
    let matchingCartItem;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingCartItem = cartItem;
        }
    });

    matchingCartItem.deliveryOptionsId = deliveryOptionId;

    saveToStorage();
}
