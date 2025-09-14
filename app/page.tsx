'use client'

import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { useCompletion } from "@ai-sdk/react";


export default function Home() {

 const {input, handleInputChange, handleSubmit} = useCompletion()
 const message = false;

  return (
    <main>
      <Image src="/logo.png" alt="logo" width={175} height={175} />
      <p className="text-2xl font-bold tracking-wider text-gray-500">TRUSTED F1 SOURCE <span className="text-[12px]">TM</span></p>
      <section>
        {message ? (
          <>
            <p className="">Ask Anything regarding F1</p>
            <br/>
            {/**<PromptSuggestionRow/> */}
          </>
        ):(
          <>
            {/**map message onto text bubbles */}
            {/**<LoadingBubble/> */}
          </>
      )}

      <form onSubmit={handleSubmit}>

        <input type="text" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} placeholder="Ask anything" />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Submit</button>
      </form>

      </section>
    </main>
  );
}
