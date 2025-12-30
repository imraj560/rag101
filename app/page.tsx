'use client'

import Image from "next/image";
import { useCompletion, useChat } from "@ai-sdk/react";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import Bubble from "./components/Bubble";
import { Message } from "openai/resources/beta/threads/messages.mjs";



export default function Home() {

 const {isLoading, input, handleInputChange, handleSubmit} = useCompletion();
 const {sendMessage} = useChat();

 const {messages, setMessages} = useChat();

 const noMessages = !messages || messages.length === 0;

const handlePrompt = (promptText: string) => {
  sendMessage({
    text: promptText,
  });

      sendMessage({
      parts: [{ type: "text", text: promptText }],
    });

  
}

  return (
    <main>
      <Image src="/logo.png" alt="logo" width={175} height={175} />
      
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="text-xl tracking-wider text-gray-400">LATEST F1 SOURCE <span className="text-[12px] font-bold">TM</span></p>
            <br/>
            <PromptSuggestionsRow onPromptClick={handlePrompt}/>
          </>
        ):(
          <>
            {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
            {isLoading && <LoadingBubble/>}
          </>
      )}

      </section>
      <form onSubmit={handleSubmit}>

        <input type="text" className="question-box" onChange={handleInputChange} placeholder="What do you want to know?" />

        <button className="submit-button" type="submit">Ask ?</button>
      </form>
    </main>
  );
}
