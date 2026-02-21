export interface IPhoneModel {
    id: string;
    name: string;
    width: number;
    height: number;
}

export const IPHONE_MODELS: IPhoneModel[] = [
    { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", width: 1320, height: 2868 },
    { id: "iphone-16-pro", name: "iPhone 16 Pro", width: 1206, height: 2622 },
    { id: "iphone-16-plus", name: "iPhone 16 Plus", width: 1290, height: 2796 },
    { id: "iphone-16", name: "iPhone 16", width: 1179, height: 2556 },
    { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", width: 1290, height: 2796 },
    { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 1179, height: 2556 },
    { id: "iphone-15", name: "iPhone 15", width: 1179, height: 2556 },
    { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", width: 1290, height: 2796 },
    { id: "iphone-14-pro", name: "iPhone 14 Pro", width: 1179, height: 2556 },
    { id: "iphone-14", name: "iPhone 14", width: 1170, height: 2532 },
    { id: "iphone-se-3", name: "iPhone SE (3rd gen)", width: 750, height: 1334 },
];

export function getModelById(id: string): IPhoneModel {
    return IPHONE_MODELS.find((m) => m.id === id) ?? IPHONE_MODELS[0];
}
