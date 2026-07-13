import { getLastNMessages } from "./MessageService.js";

async function buildContext(conversationId : string) {

    const prev_conversation = await getLastNMessages(conversationId, 10);

    return prev_conversation.reverse().map((msg) => {
        return {
            role: msg.role,
            content: msg.content
        }
    });
}

export { buildContext };