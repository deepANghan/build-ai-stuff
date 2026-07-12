import { SYSTEM_PROMPT } from "../prompts/prompt.js";
import type { ChatMessage } from "./MessageService.js";
import { OpenAIAPIcall } from "./providers/OpenAI.js";
import { NvidiaAPIcall } from "./providers/Nvidia.js";
import { getModel } from "./ModelRegisteryService.js";

async function callLLM(model : string, message : ChatMessage) {

    try {

        let res : any;

        const registeryModel = getModel(model);

        if(model == process.env.OPENAI_MODEL) {
            res = await OpenAIAPIcall(message);
        }

        if(model == process.env.NVIDIA_MODEL) {
            res = await NvidiaAPIcall(message);
        }

        return res;

    } catch (error) {

        console.log(error);

        throw new Error("Ai call Failed");
    }

}

export { callLLM };