import type { ChatUserMessage } from "@openrouter/sdk/models";
import { openRouter } from "../../config/provider.js";
import { SYSTEM_PROMPT } from "../../prompts/prompt.js";
import type { ChatMessage } from "../MessageService.js";
import { AppError } from "../../exception/AppError.js";
import { CountTokens } from "../../util/TokenCounter.js";
import type { LLMContext } from "../LLMService.js";

function buildMessages(
    context: LLMContext,
    message: ChatMessage
) {

    return [
        {
            role: "system",
            content: `
${SYSTEM_PROMPT}


Conversation summary:

${context.summary ?? "None"}


Relevant documents:

${context.documents ?? "None"}
`
        },

        ...context.history,

        {
            role:"user",
            content:message.content
        }
    ];
}


export async function NvidiaAPIcall(context: LLMContext, message: ChatMessage) {

    let messages = buildMessages(context, message);

    // console.log(messages);

    console.log(CountTokens(messages));

    try {

        const resStream = await openRouter.chat.send({
            chatRequest: {
                model: process.env.NVIDIA_MODEL,
                messages: messages as ChatUserMessage[],
                stream: true
            }
        });

        // parse response based on LLM API providers response type to our app's standard type

        return resStream;
    }
    catch (error: any) {

        console.log(error);

        throw new AppError(
            error.statusCode,
            "NVIDIA_API_ERROR",
            error.message
        )
    }


}