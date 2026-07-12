import { openRouter } from "../../config/provider.js";
import { SYSTEM_PROMPT } from "../../prompts/prompt.js";
import type { ChatMessage } from "../MessageService.js";

export async function NvidiaAPIcall(message: ChatMessage) {

    const res = await openRouter.chat.send({
        chatRequest: {
            model: process.env.NVIDIA_MODEL,
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

    return res;
}