
import { useState, useEffect } from 'react';

// This hook is used to keep state in sync with localStorage.
// It tries to read from localStorage on the initial render,
// and it saves the state to localStorage whenever it changes.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            } else {
                 setStoredValue(initialValue);
            }
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue);
        }
    }, [key, initialValue]);


    useEffect(() => {
        if (isMounted) {
             try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(error);
            }
        }
    }, [key, storedValue, isMounted]);
    

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (error) {
            console.error(error);
        }
    };
    
    return [storedValue, setValue];
}
