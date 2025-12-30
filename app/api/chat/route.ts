import OpenAI from "openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {

    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_API_TOKEN,
    OPENAI_API_KEY

} = process.env;

/**Call Open Ai */
const openai = new OpenAI({apiKey: OPENAI_API_KEY})

const client = new DataAPIClient(ASTRA_DB_API_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

export async function POST(request: Request) {

    try {

        const { messages } = await request.json();

        const lastMessage = messages[messages?.length - 1]?.content;

        let docContext = "";

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: lastMessage,
            encoding_format: "float"
        })

        try {

            const collection = await db.collection(ASTRA_DB_COLLECTION);
           
            const cursor = collection.find(null,{
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10,
            })

            const documents = await cursor.toArray();
            const docsMap = documents?.map((doc) => doc.text);
            docContext = JSON.stringify(docsMap);

        }catch(error){
            console.log("Error querying Astra DB:", error);
            docContext = "";
        }

        
        const template = {
            role: "system",
            content: `You are an AI assistant whow know everything about Formula One. Use the below context to augment what you know abot Formula One racing. The context will provide you with most recent page data from wikipedia, the official F1 Websiet and others.
             If the context does not help, just answer based on your knowledge and dont mention the source of your information or what the context does or doesnt include.
             Formant reasponses using markdonw where applicable and dont return images.
             
             START CONTEXT----------
             Context: ${docContext}
             END CONTEXT----------
             QUESTION: ${lastMessage}
             -----------------------
             `
        }

       const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [template, ...messages],
        stream: true,
        });

        for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            process.stdout.write(content);
        }
        }

    } catch (error) {
        
        throw error;
       
    }
}

