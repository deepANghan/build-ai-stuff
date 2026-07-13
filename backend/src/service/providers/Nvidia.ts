import type { ChatUserMessage } from "@openrouter/sdk/models";
import { openRouter } from "../../config/provider.js";
import { SYSTEM_PROMPT } from "../../prompts/prompt.js";
import type { ChatMessage } from "../MessageService.js";
import { AppError } from "../../exception/AppError.js";
import { CountTokens } from "../../util/TokenCounter.js";

export async function NvidiaAPIcall(context: ChatMessage[], message: ChatMessage) {

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

        throw new AppError(
            error.statusCode,
            "NVIDIA_API_ERROR",
            error.message
        )
    }


}