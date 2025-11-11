export function UpperCaseTransformer({ value }: any) {
    if (value === null || value === undefined) return value;
    if (typeof value !== 'string') return value;
    if (value.trim().length === 0) return value;
    return value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1);
}