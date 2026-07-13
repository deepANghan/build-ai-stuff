import type { ChatMessage } from "../service/MessageService.js";

function CountTokens(messages : ChatMessage[]) {

    let words = 0;

    for(let i = 0; i < messages.length; i++) {
        words += messages[i]?.content.split(" ").length!;
    }

    return Math.round(words * 1.3);
}

export { CountTokens };