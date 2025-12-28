import React from 'react'

const PromptSuggestionButton = ({text, onClick}) => {
  return (
    <div>
      <button className='prompt-suggestion-button' onClick={onClick}>{text}</button>
    </div>
  )
}

export default PromptSuggestionButton
