import { getConversation } from "./ConversationService.js";
import { getLastNMessages } from "./MessageService.js";
import { doEmbeddings } from "./providers/EmbeddingModel.js";
import { getRelavantDocs } from "./QdrantService.js";

async function buildConversationContext(conversationId : string) {

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

    return { summary: summary, history: lastMesssages };
}

async function buildKnowledgeContext(
    query: string
) {
    const [embedding] = await doEmbeddings([query]);

    const docs = await getRelavantDocs(embedding?.embedding as number[]);

    if (
        docs.length === 0 ||
        (docs.length > 0 && docs[0]!.score < 0.75)
    ) {
        return "";
    }

    return docs
        .map((doc, i) => `
Document ${i + 1}

${doc.payload?.text}
`)
        .join("\n\n");
}

export { buildConversationContext, buildKnowledgeContext };