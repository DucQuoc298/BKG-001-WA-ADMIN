export function useKey() {
    const getKey = (key: string) => {
        return localStorage.getItem(key);
    };
    const setKey = (key: string, value: string) => {
        return localStorage.setItem(key, value);
    };
    const removeKey = (key: string) => {
        localStorage.removeItem(key);
    };
    return {
        getKey,
        setKey,
        removeKey
    }
}