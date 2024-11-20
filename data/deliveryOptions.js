import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";
import localeRu from "https://unpkg.com/dayjs@1.11.13/esm/locale/ru.js";

dayjs.locale(localeRu);

export const deliveryOptions = [
    {
        id: "1",
        deliveryDays: 7,
        priceCents: 0,
    },
    {
        id: "2",
        deliveryDays: 3,
        priceCents: 499,
    },
    {
        id: "3",
        deliveryDays: 1,
        priceCents: 999,
    },
];

export function getDeliveryOption(deliveryOptionsId) {
    let deliveryOption;

    deliveryOptions.forEach((deliveryOptionsProduct) => {
        if (deliveryOptionsProduct.id === deliveryOptionsId) {
            deliveryOption = deliveryOptionsProduct;
        }
    });
    return deliveryOption;
}

// !function for deliveryDays
function isWeekend(date) {
    const dayOfWeek = date.format("dddd");

    return dayOfWeek === "суббота" || dayOfWeek === "воскресенье";
}

export function calculateDeliveryDate(deliveryOption) {
    let today = dayjs();

    let remainingDays = deliveryOption.deliveryDays;

    while (remainingDays > 0) {
        today = today.add(1, "day");

        if (!isWeekend(today)) {
            remainingDays--;
        }
    }

    let monthString = today.format("MMMM");
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);

    let days = today.format("dddd");
    days = days.charAt(0).toUpperCase() + days.slice(1);

    let dataString = today.format(`${days} ${monthString} D`);

    return dataString;
}
