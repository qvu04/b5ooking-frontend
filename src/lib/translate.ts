// lib/translate.ts

export const translateText = async (
    text: string,
    from: string = "vi",
    to: string = "en"
): Promise<string> => {
    try {
        const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, from, to }),
        });

        if (!res.ok) throw new Error("Translate API failed");

        const data = await res.json();
        return data.translatedText;
    } catch (err) {
        console.error("translateText error:", err);
        return text; // fallback: return original if failed
    }
};
