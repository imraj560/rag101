import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from "openai";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {

    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_API_TOKEN,
    OPENAI_API_KEY

} = process.env;

/**Call Open Ai */
const openai = new OpenAI({apiKey: OPENAI_API_KEY})

/**This is from where we will scrap the data from websites and then upload for vector embeddings */
const ragData = [

    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com/'

]

const client = new DataAPIClient(ASTRA_DB_API_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

const splitter = new RecursiveCharacterTextSplitter({

    chunkSize: 512, /**each llm has a individual chunk size you have to check the astra doc */
    chunkOverlap: 100
})

const createCollection = async(similarityMetric: SimilarityMetric = "dot_product") => {

    

    const res = await db.createCollection(ASTRA_DB_COLLECTION, {

        vector: {

            dimension: 1536,
            metric: similarityMetric
        }
    })

    console.log(res);


}


/**Now we have to define the function to scrape the page, we are going to use puppetter webbase loader to do it, we will use this in the embede function */

const scrapePage = async(url: string) => {

    const loader = new PuppeteerWebBaseLoader(url, {

        launchOptions: {headless: true},
        gotoOptions: {waitUntil: 'domcontentloaded'},
    })

    const result = await loader.load();
    return result;
}



/**Now lets embeed the vector data where we scrape and insert the vector data collectoin into the database */

const loadSampleData = async() => {

    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for await (const url of ragData){

        const content = await scrapePage(url);
        const chunks = await splitter.splitDocuments(content);

        for await (const chunk of chunks){

           const embedding = await openai.embeddings.create({
                 model: "text-embedding-3-small",
                 input: chunk.pageContent,
                 encoding_format: "float"
           })

           const vector = embedding.data[0].embedding;

           const res = await collection.insertOne({

                $vector : vector,
                text: chunk.pageContent
           })

           console.log(res)
        }
    }
}





createCollection().then(()=> loadSampleData())












