// src/app/api/translate/route.ts
import { NextRequest } from "next/server";
const translate = require("translate-google");

export async function POST(req: NextRequest) {
    try {
        const { text, from = "vi", to = "en" } = await req.json();

        if (!text || typeof text !== "string") {
            return new Response(JSON.stringify({ error: "Missing 'text'" }), { status: 400 });
        }

        const result = await translate(text, { from, to });

        return new Response(JSON.stringify({ translatedText: result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Translation error:", err);
        return new Response(JSON.stringify({ error: "Translation failed" }), { status: 500 });
    }
}
