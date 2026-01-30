import { parseDocument } from "htmlparser2";
import { isText } from "domutils";
import render from "dom-serializer";
import { translateText } from "@/lib/translate";

import { Element, DataNode } from "domhandler";

function getAllTextNodes(node: any): DataNode[] {
    const result: DataNode[] = [];

    const traverse = (node: any) => {
        if (isText(node)) {
            result.push(node);
        } else if (node.children) {
            for (const child of node.children) {
                traverse(child);
            }
        }
    };

    traverse(node);
    return result;
}

export const translateHTMLContent = async (
    htmlContent: string,
    fromLang: string,
    toLang: string
): Promise<string> => {
    const dom = parseDocument(htmlContent);

    const textNodes = getAllTextNodes(dom);

    await Promise.all(
        textNodes.map(async (node) => {
            if (node.data.trim()) {
                try {
                    const translated = await translateText(node.data, fromLang, toLang);
                    node.data = translated;
                } catch (err) {
                    console.error("Lỗi dịch:", err);
                }
            }
        })
    );

    return render(dom);
};
