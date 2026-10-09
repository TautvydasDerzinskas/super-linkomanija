import { useState, type KeyboardEvent } from 'react';

import './keywords-input.component.scss';

interface IKeywordsInputComponentProps {
  id: string;
  keywords: string[];
  placeholder: string;
  variant: 'excluded' | 'preferred';
  onChange: (keywords: string[]) => void;
}

export default function KeywordsInputComponent({ id, keywords, placeholder, variant, onChange }: IKeywordsInputComponentProps) {
  const [text, setText] = useState('');

  const addKeywords = (value: string) => {
    const newKeywords = value.split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword && !keywords.some(existing => existing.toLowerCase() === keyword.toLowerCase()));
    if (newKeywords.length > 0) {
      onChange([...keywords, ...newKeywords]);
    }
    setText('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      // Enter would submit the form otherwise
      event.preventDefault();
      addKeywords(text);
    } else if (event.key === 'Backspace' && text === '' && keywords.length > 0) {
      onChange(keywords.slice(0, -1));
    }
  };

  return (
    <div className='keywords-input'>
      {keywords.map(keyword => (
        <span key={keyword} className={`keywords-input__keyword keywords-input__keyword--${variant}`}>
          {keyword}
          <button type='button' onClick={() => onChange(keywords.filter(existing => existing !== keyword))}>×</button>
        </span>
      ))}
      <input
        id={id}
        type='text'
        value={text}
        placeholder={keywords.length === 0 ? placeholder : ''}
        onChange={event => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addKeywords(text)}
      />
    </div>
  );
}
