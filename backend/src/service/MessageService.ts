import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";

export interface ChatMessage {
    role: string
    content: string
}

async function createMessage(data : { conversationId : string, message : ChatMessage, model? : string, tokenCount? : number}) {

    return await prisma.messages.create({
        data:{
            messageId: randomUUID().toString(),
            conversationId:data.conversationId,
            role:data.message.role,
            content:data.message.content,
            tokenCount:data.tokenCount ?? 0,
            model:data.model ?? ""
        }
    });

}

export { createMessage };