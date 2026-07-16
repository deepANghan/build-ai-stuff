import { SYSTEM_PROMPT } from "../prompts/prompt.js";
import type { ChatMessage } from "./MessageService.js";
import { OpenAIAPIcall } from "./providers/OpenAI.js";
import { NvidiaAPIcall } from "./providers/Nvidia.js";
import { getModel } from "./ModelRegisteryService.js";

export interface LLMContext {
    summary? : string
    history : ChatMessage[],
    documents? : string
}

async function callLLM(model : string, context : LLMContext, message : ChatMessage) {

    try {

        let streamResponse : any;
        
        const registeryModel = getModel(model);

        if(model == process.env.OPENAI_MODEL) {
            streamResponse = await OpenAIAPIcall(context, message);
        }

        console.log(model, process.env.NVIDIA_MODE)

        if(model == process.env.NVIDIA_MODEL) {

            streamResponse = await NvidiaAPIcall(context, message);
        }

        return streamResponse;

    } catch (error) {

        console.log(
            "LLM ERROR:",
            error
        );

        throw error;
    }

}

export { callLLM };