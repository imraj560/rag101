import React from 'react'
import PromptSuggestionButton from './PromptSuggestionButton';

function PromptSuggestionsRow({onPromptClick}) {


  const prompts = [
    'Who is the most popular F1 driver of all time?',
    'What are the top 5 F1 teams in history?',
    'How has F1 technology evolved over the years?'
  ]

  return (
    <div className='prompt-suggestions-row'>
      {prompts.map((prompt, index) => <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)}/>)}
    </div>
  )
}

export default PromptSuggestionsRow
