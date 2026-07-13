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

async function getLastNMessages(conversationId : string, n : number) {

    const messages = await prisma.messages.findMany({
        where: {
            conversationId: conversationId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: n
    });

    return messages;

}

async function countMessagesAfterSequence(conversationId : string, summarized_till : number) {

    const messages = await prisma.messages.findMany({
        where: {
            sequenceNumber: {
                gt: summarized_till
            }
        }
    });

    return messages.length;
}


async function getUnSummarizedMessages(conversationId: string) {

    const conversation = await prisma.conversations.findFirst({
        where: {
            conversationId: conversationId
        }
    });

    const messages = await prisma.messages.findMany({
        where: {
            sequenceNumber: {
                gt: conversation?.summarized_till as number
            }
        }
    })

    return messages;
}


export { createMessage, getLastNMessages, getUnSummarizedMessages, countMessagesAfterSequence };