import { formatCurrency } from "../../script/utils/money.js";

describe("набор тестов: формат валюты", () => {
    it("конвертирует центы в доллары", () => {
        expect(formatCurrency(2095)).toEqual("20.95");
    });

    it("работа с цифром 0", () => {
        expect(formatCurrency(0)).toEqual("0.00");
    });

    it("округляет до ближайшего сента", () => {
        expect(formatCurrency(2000.5)).toEqual("20.01");
    });
});
