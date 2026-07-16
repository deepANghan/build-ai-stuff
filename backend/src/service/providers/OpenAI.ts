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


export async function OpenAIAPIcall(context: LLMContext, message: ChatMessage) {

    const messages = buildMessages(context, message);

    console.log(context, "from Input Layer");

    console.log(CountTokens(messages));

    try {
        const res = await openRouter.chat.send({
            chatRequest: {
                model: process.env.OPENAI_MODEL,
                messages: messages as ChatUserMessage[],
                stream: true
            }
        });

        // parse response based on LLM API providers response type to our app's standard type

        return res;
    }
    catch (error: any) {

        throw new AppError(
            error.statusCode,
            "OPENAI_API_ERROR",
            error.message
        )
    }
}

export async function OpenAIAPIcallNormal(context: ChatMessage[], message: ChatMessage) {

    let messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
        ...context,
        {
            role: "user",
            content: message.content
        }
    ]

    // console.log(CountTokens(messages));

    try {
        const res = await openRouter.chat.send({
            chatRequest: {
                model: process.env.OPENAI_MODEL,
                messages: messages as ChatUserMessage[]
            }
        });

        // parse response based on LLM API providers response type to our app's standard type

        return res;
    }
    catch (error: any) {

        throw new AppError(
            error.statusCode,
            "OPENAI_API_ERROR",
            error.message
        )
    }
}

