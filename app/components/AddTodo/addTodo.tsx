import React, { useState, ChangeEvent } from 'react';

interface InputButtonProps {
  onSubmit: (todo: string) => void;
  placeHolder?: string;
  loading?: boolean
}

const InputButton: React.FC<InputButtonProps> = ({ onSubmit, loading, placeHolder }) => {
  const [text, setText] = useState<string>('');

  const handleAddClick = () => {
    if (text.trim() !== '') {
      // Invoke the onSubmit callback with the text
      onSubmit(text.trim());
      // Clear the input field after submit
      setText('');
    }
  };

  // Handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder={placeHolder || "Add a new todo..."}
        value={text}
        disabled={loading}
        onChange={handleInputChange}
        style={{
          padding: '10px',
          marginRight: '10px',
          flex: '1',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleAddClick}
        style={{
          padding: '10px',
          background: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Add
      </button>
    </div>
  );
};

export default InputButton;
