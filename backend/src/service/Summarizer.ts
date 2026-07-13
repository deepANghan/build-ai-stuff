import { models } from "../config/ModelRegistery.js";
import { getConversation, updateChatSummary } from "./ConversationService.js";
import { callLLM } from "./LLMService.js";
import { countMessagesAfterSequence, getUnSummarizedMessages } from "./MessageService.js";
import { OpenAIAPIcallNormal } from "./providers/OpenAI.js";

async function NeedSummarization(conversationId: string) {

    const conversation = await getConversation(conversationId);

    let summarized_till = conversation?.summarized_till as number;

    return await countMessagesAfterSequence(conversationId, summarized_till) > 10;
}

async function SummarizeChat(conversationId: string) {

    const conversation = await getConversation(conversationId);

    if(!conversation) {
        return "";
    }

    const lastMessages = await getUnSummarizedMessages(conversationId);

    const result =
        await OpenAIAPIcallNormal(
            [],
            {
                role: "user",
                content: `
Existing summary:

${conversation.summary ?? "None"}


New conversation messages:

${lastMessages.map(m =>
                    `${m.role}: ${m.content}`
                ).join("\n")}


Create an updated summary.
Keep:
- important user information
- decisions
- project context
- preferences

Remove:
- greetings
- repetition
`
            }
        );

    await updateChatSummary(conversationId, result.choices[0]?.message.content, lastMessages[lastMessages.length - 1]?.sequenceNumber as number);
}   

export { NeedSummarization, SummarizeChat };