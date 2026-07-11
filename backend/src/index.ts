import dotenv from "dotenv";

dotenv.config();

let apiToken = process.env.apiToken ?? "";

interface Message {
    role : string,
    content : string
}

const calculateTotalTool = {
  type: "function",
  function: {
    name: "Add",
    description: "Add 2 Numbers",
    parameters: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "The base cost of the item before tax."
        },
        b: {
          type: "number",
          description: "The tax percentage expressed as a decimal (e.g., 0.15 for 15%)."
        }
      },
      required: ["a", "b"] // Define which arguments the LLM MUST provide
    }
  }
};

const toolsList = [calculateTotalTool];

function doAdd({a , b } : { a : number, b : number }) {
    return a + b;
}

const tools = {
    Add: doAdd
};

const system_prompt : Message = {
    role: "system",
    content: `
    You are a helpful assistant that can perform calculations. You can use the provided tools to assist the user.
    
    Give precise and small answers only.

    Tools : ${JSON.stringify(toolsList)}
    
    give output in structured JSON format.

    example:
    {
        type:'tool_call',
        name:'tool_name',
        args:{
            arg1: value,
            arg2: value,
            ...
        }
    }
    `
}

async function LLMCall(messages : Message[]) {

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
            model: "nvidia/nemotron-3-super-120b-a12b:free",
            messages: messages,
            tools: tools
        })
    });

    const data = await res.json();

    let llm_res = data.choices[0].message.content;

    try
    {
        let parsed_res : any = JSON.parse(llm_res);

        if(parsed_res.type == "tool_call") {
            
            let tool_name = parsed_res.name as string;

            let tool = tools[tool_name as keyof typeof tools];

            let ans = tool(parsed_res.args);

            let toolMessage : Message = {
                role:"tool",
                content: ans.toString()
            }
            
            messages.push(toolMessage);
        }
        else {
            messages.push({
                role: "assitant",
                content: llm_res
            });
        }

    }
    catch(error : unknown) {
        console.log(error);
    }
}


const userMessage : Message = {
    role: "user",
    content: "Add 5 and 10"
}


let messages = [system_prompt, userMessage];

async function main() {

    while(true) {
        
        await LLMCall(messages);

        if(messages.pop()?.role != 'tool') {
            break;
        }

    }

    console.log(messages);
}

main();

