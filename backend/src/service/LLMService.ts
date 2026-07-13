import { SYSTEM_PROMPT } from "../prompts/prompt.js";
import type { ChatMessage } from "./MessageService.js";
import { OpenAIAPIcall } from "./providers/OpenAI.js";
import { NvidiaAPIcall } from "./providers/Nvidia.js";
import { getModel } from "./ModelRegisteryService.js";

async function callLLM(model : string, context : ChatMessage[], message : ChatMessage) {

    try {

        let streamResponse : any;

        const registeryModel = getModel(model);

        if(model == process.env.OPENAI_MODEL) {
            streamResponse = await OpenAIAPIcall(context, message);
        }

        if(model == process.env.NVIDIA_MODEL) {
            streamResponse = await NvidiaAPIcall(context, message);
        }

        return streamResponse;

    } catch (error) {
        throw error;
    }

}

export { callLLM };