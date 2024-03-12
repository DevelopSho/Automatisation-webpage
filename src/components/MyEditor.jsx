import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import "../styles/CharacterForm.css"

const MyEditor = ({ onEditorChange, initialContent }) => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (initialContent) {
      setEditorContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (content) => {
    setEditorContent(content);
    onEditorChange(content);
  };

  // Odstraněno tlačítko pro odeslání formuláře

  useEffect(() => {
    setEditorContent(initialContent);
  }, [initialContent]);

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={editorContent}
        onChange={handleChange}
        className="position-editor"
      />
    </div>
  );
};

export default MyEditor;