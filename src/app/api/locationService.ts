import { translateText } from "@/lib/translate";
import { Locations } from "../types/locationTypes";
import { https } from "./configService"

export const getSomeLocation = () => {
    return https.get("/api/hotel/getSomeLocaltions", { noLoading: true });
}
export const fetchSomeLocation = async () => {
    try {
        const res = await getSomeLocation();
        const locations = res.data.data.locations;
        return locations;
    } catch (error) {
        console.log('✌️error --->', error);
    }
}
export const getAllLocation = () => {
    return https.get("/api/hotel/getAllLocations");
}
export const fetchAllLocation = async () => {
    const res = await getAllLocation();
    const locations = res.data.data.locations;
    return locations;
}
export const fetchTranslateLocation = async (lang: string): Promise<Locations[]> => {
    try {
        const res = await getSomeLocation();
        const locations: Locations[] = res.data.data.locations;
        if (lang === "vi") return locations
        const translate = await Promise.all(
            locations.map(async (loc) => {
                const city = await translateText(loc.city, "vi", lang);
                return { ...loc, city };
            })
        )
        return translate;
    } catch (error) {
        console.log('✌️error --->', error);
        return [];
    }

}
export const fetchTranslateAllLocation = async (lang: string): Promise<Locations[]> => {
    try {
        const res = await getAllLocation();
        const locations: Locations[] = res.data.data.locations;
        if (lang === "vi") return locations
        const translate = await Promise.all(
            locations.map(async (loc) => {
                const city = await translateText(loc.city, "vi", lang);
                return { ...loc, city };
            })
        )
        return translate;
    } catch (error) {
        console.log('✌️error --->', error);
        return [];
    }

}