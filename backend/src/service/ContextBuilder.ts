import { getConversation } from "./ConversationService.js";
import { getLastNMessages } from "./MessageService.js";

async function buildContext(conversationId : string) {

    const conversation = await getConversation(conversationId);

    let summary = conversation?.summary ?? "none";

    const prev_conversation = await getLastNMessages(conversationId, 10);

    let lastMesssages = prev_conversation.reverse().map((msg) => {
        return {
            role: msg.role,
            content: msg.content
        }
    });

    let summaryMessage = {
        role: "assistant",
        content: summary
    }

    return [summaryMessage, ...lastMesssages];
}

export { buildContext };