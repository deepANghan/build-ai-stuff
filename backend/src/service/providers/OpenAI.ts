import { openRouter } from "../../config/provider.js";
import { SYSTEM_PROMPT } from "../../prompts/prompt.js";
import type { ChatMessage } from "../MessageService.js";

export async function OpenAIAPIcall(message: ChatMessage) {

    const res = await openRouter.chat.send({
        chatRequest: {
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message.content
                }
            ]
        }
    });

    // parse response based on LLM API providers response type to our app's standard type

    return res;
}