import ChatBubble from "./ChatBox";
export function ChatBox({ visible = true }: { visible?: boolean }) {
    if (!visible) return null; // không render gì nếu hidden
    return <ChatBubble visible={visible} />;
}
