import type { NextFunction, Request, Response } from "express";
import { createConversation, getConversation, getConversations } from "../service/ConversationService.js";
import { createMessage } from "../service/MessageService.js";
import { callLLM } from "../service/LLMService.js";
import { buildContext } from "../service/ContextBuilder.js";
import { NeedSummarization, SummarizeChat } from "../service/Summarizer.js";


async function PostChatController(request: Request, response : Response) {

    const conversation = await createConversation();

    return response.status(201).json({
        success: true,
        message: "Conversation created successfully",
        data: {
            conversationId : conversation.conversationId,
            createdAt: conversation.createdAt
        }
    });

}

async function PostMessageController(request: Request, response : Response, next : NextFunction) {
    
    const { conversationId } = request.params;
    const { model, message } = request.body;

    if(!message || message == "") {

        return response.status(400).json({
            success: false,
            message: "Message is required"
        });
    
    }

    try
    {
        const userMessage = await createMessage({
                conversationId: conversationId as string,
                message: {
                    role: "user",
                    content: message
                },
                model: "",
                tokenCount: 0
            });

            if(await NeedSummarization(conversationId as string)) {
                await SummarizeChat(conversationId as string);
            }

            const context = await buildContext(conversationId as string);
            
            const llmResponse = await callLLM(model, context, {
                role: "user",
                content: message
            });

            // {
            //     choices:[ messages ],
            //     usage : { token usage },
            //     model,
            //     id,
            //     etc
            // }

            const aiMessage = await createMessage({
                conversationId: conversationId as string,
                message: {
                    role: "assistant",
                    content: llmResponse.choices[0]?.message.content
                },
                model: llmResponse.model,
                tokenCount: llmResponse.usage?.completionTokens as number
            });

            return response.status(200).json({
                success: true,
                data: {
                    aiMessage: {
                        role: aiMessage.role,
                        content: aiMessage.content
                    }   
                }
            });
    }
    catch(error : any) {
        console.log(error.message);
        next(error);
    }
  
}   

async function GetConversationsController(request: Request, response : Response) {

    const conversations = await getConversations();

    return response.status(200).json({
        success: true,
        data: {
           conversation: conversations
        }
    });

}

async function GetMessageController(request: Request, response : Response) {

    const { conversationId } = request.params;

    const conversation = await getConversation(conversationId as string);

    return response.status(200).json({
        success: true,
        message: "Conversation created successfully",
        data: {
           conversation: conversation
        }
    });

}

export { PostChatController, PostMessageController, GetMessageController, GetConversationsController };