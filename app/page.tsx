'use client'

import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { useCompletion } from "@ai-sdk/react";


export default function Home() {

 const {isLoading, input, handleInputChange, handleSubmit} = useCompletion();
 const {messages, setMessages} = useChat();

 const noMessages = true;

  return (
    <main>
      <Image src="/logo.png" alt="logo" width={175} height={175} />
      
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="text-xl tracking-wider text-gray-400">LATEST F1 SOURCE <span className="text-[12px] font-bold">TM</span></p>
            <br/>
            {/**<PromptSuggestionRow/> */}
          </>
        ):(
          <>
            {/**map message onto text bubbles */}
            {/**<LoadingBubble/> */}
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
