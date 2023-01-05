import {
    isObject,
    isEmptyObj,
    isString,
    intToBillions,
    minVal,
} from "./helpers";

describe("Test for helpers", () => {
    describe("test for isObject function", () => {
        it("checks if a param is an object", () => {
            const arr = [1, 2, 3];
            const obj = {
                id: 0,
                name: "",
            };
            const nullVariable = null;

            expect(isObject(arr)).toEqual(false);
            expect(isObject(obj)).toEqual(true);
            expect(isObject(nullVariable)).toEqual(false);
        });
    });

    describe("test for isEmptyObj function", () => {
        it("checks if an object is empty", () => {
            const objNotEmpty = {
                id: 0,
                name: "",
            };
            const objEmpty = {};

            expect(isEmptyObj(objNotEmpty)).toEqual(false);
            expect(isEmptyObj(objEmpty)).toEqual(true);
        });
    });

    describe("test for isString function", () => {
        it("checks if param is a string or an instance of string", () => {
            const s = "";
            // eslint-disable-next-line no-new-wrappers
            const arg = new String(9);

            expect(isString(s)).toEqual(true);
            expect(isString(arg)).toEqual(true);
        });
    });

    describe("test for intToBillion function", () => {
        it("checks if intToBillion behaves properly", () => {
            expect(intToBillions(3200000)).toBe("0.00B");
            expect(intToBillions(32000000)).toBe("0.03B");
            expect(intToBillions(3200000000)).toBe("3.20B");
            expect(intToBillions(320000000000000)).toBe("320000.00B");
        });
    });

    describe("test for  minVal function", () => {
        it("checks for smaller value", () => {
            const arr = [[1, 2, 3]];
            const num = [
                [1, 20000000000, 3000],
                [45, 9000, 56043],
            ];
            expect(minVal(arr)).toStrictEqual([2]);
            expect(minVal(num)).not.toStrictEqual([20000000000]);
        });
    });
});
