/* eslint-disable @typescript-eslint/no-unsafe-return */

// eslint-disable-next-line
export const isObject = (param: any): boolean =>
    typeof param === "object" && !Array.isArray(param) && param !== null;

// eslint-disable-next-line
export const isEmptyObj = (param: any): boolean =>
    isObject(param) && Object.keys(param).length === 0;

// eslint-disable-next-line
export const isString = (s: any): boolean =>
    typeof s === "string" || s instanceof String;

// eslint-disable-next-line
export const isNumber = (n: any): boolean =>
    !isNaN(parseFloat(n)) && isFinite(n);

export const intToBillions = (val: number): string =>
    `${(val / 1e9).toFixed(2)}B`;

export function minVal(items: number[][]): number[] {
    return items.reduce(
        (acc, val) => {
            // eslint-disable-next-line no-param-reassign
            acc[0] = val[1] < acc[0] ? val[1] : acc[0];
            return acc;
        },
        [1e10]
    );
}

/**
 * takes an array of objects containing a numeric id and returns a dictionary
 * in the form:
 * {
 *   id1: elem1,
 *   id2: elem2,
 *   ...
 * }
 */
export const arrayAsDictById = <T extends { id: number }>(
    arr: T[]
): Record<number, T> => {
    return arr.reduce((acc, newVal) => {
        // eslint-disable-next-line no-param-reassign
        acc[newVal.id] = newVal;
        return acc;
    }, {} as Record<number, T>);
};

export const delay = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

// Ignores any concurrent calls to this function
// and instead instantly resolves with null
export const ignoreConcurrentAsync = <T, R>(
    handler: (arg: T) => Promise<R>,
    additionalDelay?: number
): ((arg: T) => Promise<R | null | undefined>) => {
    let inProgress = false;
    return async (...args) => {
        if (inProgress) return null;
        inProgress = true;
        try {
            return await handler(...args);
        } finally {
            // note: don't await on purpose
            delay(additionalDelay || 0)
                .then(() => {
                    inProgress = false;
                })
                .catch((_e) => {
                    // do nothing
                });
        }
    };
};
