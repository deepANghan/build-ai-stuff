import type { NextFunction, Request, Response } from "express";
import { createConversation, getConversation, getConversations } from "../service/ConversationService.js";
import { createMessage } from "../service/MessageService.js";
import { callLLM } from "../service/LLMService.js";
import { buildContext } from "../service/ContextBuilder.js";
import { NeedSummarization, SummarizeChat } from "../service/Summarizer.js";
import { getEncoding } from "js-tiktoken";

const enc = getEncoding("cl100k_base");

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

        let headersSent = false;

    try
    {
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        headersSent = true;

        let isClientConnected = true;
        let aiCombinedResponse = "";
        let outputTokenCount = 0;

            request.on('close', () => {
                isClientConnected = false;
            });

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
            
            const llmStream = await callLLM(model, context, {
                role: "user",
                content: message
            });

            // console.log(llmStream);

            for await (let chunk of llmStream) {

                // console.log(chunk);

                // console.log("this is object", chunk.choices[0].delta);

                // if(!isClientConnected) break;

                const token = chunk.choices[0].delta.content || "";


                if(token) {
                    aiCombinedResponse += token;

                    outputTokenCount++;

                    response.write(`data: ${JSON.stringify({text : token})}\n\n`);
                }
                
            }

            // console.log("stream finished");

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
                    content: aiCombinedResponse
                },
                model: model,
                tokenCount: outputTokenCount
            });

            console.log("stored response in db", aiMessage);

            if(isClientConnected) {
                response.write('event: done\ndata: [DONE]\n\n');
                response.end();
            }
            // return response.status(200).json({
            //     success: true,
            //     data: {
            //         aiMessage: {
            //             role: aiMessage.role,
            //             content: aiMessage.content
            //         }   
            //     }
            // });

            return; 
    
        }
    catch(error : any) {
        console.log(error.message);

        if(headersSent) {
            response.write(`data: ${JSON.stringify({ error: "Stream disconnected unexpectedly." })}\n\n`);
            response.end();
            return ;
        }

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