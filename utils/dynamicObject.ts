export type DynamicObject = {
    [key: string]: any;
};

export function createDynamicObject(fields: [string, unknown][]): DynamicObject {
    const result: DynamicObject = {};
    fields.forEach(([key, value]) => {
        result[key] = value;
    });
    return result;
}