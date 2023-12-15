import React from 'react';

interface TodoItemProps {
  todo: {
    id: string;
    title: { en: string };
    completed?: boolean;
  };
  onToggleComplete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete }) => {
  const textStyles = {
    color: 'black',
    textDecoration: todo.completed ? 'line-through' : 'none',
    flex: '1',
  };

  const checkboxStyles = {
    marginRight: '10px',
  };

  return (
    <div
      key={todo.id}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        style={checkboxStyles}
      />
      <span style={textStyles}>{todo.title.en}</span>
    </div>
  );
};

export default TodoItem;
