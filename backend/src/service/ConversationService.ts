import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma.js";

async function createConversation() {

    const conversation = await prisma.conversations.create({
        data: {
            conversationId: randomUUID().toString(),
            createdAt: new Date()
        },
    });

    return conversation;
}

async function getConversations() {

    const data = await prisma.conversations.findMany({});

    return data;
}

async function getConversation(conversationId : string) {

    const conversation = await prisma.conversations.findFirst({
        where: {
            conversationId: conversationId
        },
        include: {
            Messages: true
        }
    });

    return conversation;
}


export { createConversation, getConversation, getConversations };