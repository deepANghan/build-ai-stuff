export const models = [
    {
        id: 1,
        name: "openai/gpt-oss-20b:free",
        provider: "openAI",
        capabilities: [
            "chat"
        ],
        contextWindow: 128000,
        enabled: true
    },
    {
        id: 2,
        name: "nvidia/nemotron-3-super-120b-a12b:free",
        provider: "NVIDIA",
        capabilities: [
            "chat"
        ],
        contextWindow: 128000,
        enabled: true
    }
];