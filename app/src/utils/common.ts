import { DependencyList, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/** Return whether parameter is undefined */
export function isUndefined(param: any): boolean {
    return typeof param === 'undefined';
}

/** Return whether parameter is undefined or empty */
export function isEmpty(param: any): boolean {
    return isUndefined(param) || Object.keys(param).length === 0;
}

/** useEffect for an asynchronous function */
export function useEffectAsync(fn: Function, deps?: DependencyList) {
    useEffect(() => {
        fn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

/** Get UUID */
export function getUuid(): string {
    return uuidv4();
}
