import { useEffect, useRef, useState } from "react";

const API = "http://localhost:3000/api/v1/chat";
const MODEL_API = "http://localhost:3000/api/v1/model";

interface Conversation {
  conversationId: string;
  createdAt: string;
}

interface Message {
  role: string;
  content: string;
}

interface Model {
  id: number;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  enabled: boolean;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    loadModels();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function loadConversations() {
    try {
      const res = await fetch(API);
      const json = await res.json();

      setConversations(json.data.conversation);
    } catch (err) {
      console.log(err);
    }
  }


  async function loadModels() {
    try {
      const res = await fetch(MODEL_API);
      const json = await res.json();

      const enabledModels = json.data.models.filter(
        (model: Model) => model.enabled
      );

      setModels(enabledModels);

      if (enabledModels.length > 0) {
        setSelectedModel(enabledModels[0].name);
      }

    } catch (err) {
      console.log(err);
    }
  }


  async function createConversation() {
    try {
      const res = await fetch(`${API}/create`, {
        method: "POST",
      });

      const json = await res.json();

      setConversationId(json.data.conversationId);
      setMessages([]);

      loadConversations();

    } catch (err) {
      console.log(err);
    }
  }


  async function openConversation(id: string) {
    try {
      const res = await fetch(`${API}/${id}`);

      const json = await res.json();

      setConversationId(id);

      setMessages(
        json.data.conversation.Messages ?? []
      );

    } catch (err) {
      console.log(err);
    }
  }


  async function sendMessage() {

    if (!message.trim()) return;


    if (!conversationId) {
      await createConversation();
      return;
    }


    const userMessage = {
      role: "user",
      content: message,
    };


    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);


    const currentMessage = message;

    setMessage("");

    setLoading(true);


    try {

      const res = await fetch(`${API}/${conversationId}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: currentMessage,
          model: selectedModel,
        }),
      });


      const json = await res.json();


      setMessages((prev) => [
        ...prev,
        {
          role: json.data.aiMessage.role,
          content: json.data.aiMessage.content,
        },
      ]);


    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="flex h-screen bg-gray-100">


      {/* Sidebar */}

      <aside className="w-72 border-r bg-white">

        <div className="border-b p-4">

          <button
            onClick={createConversation}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            + New Chat
          </button>

        </div>


        <div className="overflow-y-auto">

          {conversations.map((conversation) => (

            <button

              key={conversation.conversationId}

              onClick={() =>
                openConversation(
                  conversation.conversationId
                )
              }

              className={`w-full border-b p-4 text-left hover:bg-gray-100 ${
                conversationId === conversation.conversationId
                  ? "bg-blue-50"
                  : ""
              }`}
            >

              <p className="font-medium">
                {conversation.conversationId.slice(0, 8)}
              </p>


              <p className="text-sm text-gray-500">

                {new Date(
                  conversation.createdAt
                ).toLocaleString()}

              </p>

            </button>

          ))}

        </div>

      </aside>




      {/* Chat */}

      <div className="flex flex-1 flex-col">


        {/* Header */}

        <div className="border-b bg-white p-4 flex items-center justify-between">


          <h1 className="text-xl font-semibold">
            AI Chat
          </h1>


          <select

            value={selectedModel}

            onChange={(e) =>
              setSelectedModel(e.target.value)
            }

            className="rounded-lg border px-3 py-2"

          >

            {models.map((model) => (

              <option
                key={model.id}
                value={model.name}
              >

                {model.name} ({model.provider})

              </option>

            ))}

          </select>


        </div>




        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6">


          {messages.length === 0 && (

            <div className="mt-24 text-center text-gray-400">

              Start a conversation 👋

            </div>

          )}



          <div className="space-y-4">


            {messages.map((msg, index) => (

              <div

                key={index}

                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}

              >

                <div

                  className={`max-w-2xl rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow"
                  }`}

                >

                  {msg.content}

                </div>


              </div>

            ))}



            {loading && (

              <div className="flex justify-start">

                <div className="rounded-xl bg-white px-4 py-3 shadow">

                  AI is typing...

                </div>

              </div>

            )}



            <div ref={bottomRef} />


          </div>


        </div>





        {/* Input */}

        <div className="border-t bg-white p-4">


          <div className="flex gap-3">


            <input

              value={message}

              onChange={(e) =>
                setMessage(e.target.value)
              }

              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  sendMessage();
                }

              }}

              placeholder="Ask anything..."

              className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500"

            />



            <button

              disabled={loading}

              onClick={sendMessage}

              className="rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50"

            >

              Send

            </button>


          </div>


        </div>


      </div>


    </div>
  );
}