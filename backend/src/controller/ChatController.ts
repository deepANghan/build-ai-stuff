import type { Request, Response } from "express";
import { createConversation, getConversation, getConversations } from "../service/ConversationService.js";
import { createMessage } from "../service/MessageService.js";
import { callLLM } from "../service/LLMService.js";


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

async function PostMessageController(request: Request, response : Response) {
    
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

            const llmResponse = await callLLM(model, {
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
                    role: "ai",
                    content: llmResponse.choices[0]?.message.content
                },
                model: llmResponse.model,
                tokenCount: llmResponse.usage?.completionTokens as number
            })

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
    catch(error) {
        console.log(error);

        return response.status(500).json({
            success: false,
            error: "Something went wrong"
        });
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