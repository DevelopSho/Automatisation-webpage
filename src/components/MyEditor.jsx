import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState } from 'react';
import "../styles/CharacterMenu.css";

const MyEditor = ({ onEditorChange }) => {
  const [editorContent, setEditorContent] = useState('');

  const handleChange = (content) => {
    // Obsluha změn obsahu editoru
    setEditorContent(content);
    onEditorChange(content); // Předáváme obsah editoru do nadřazené komponenty
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorContent}
      onChange={handleChange}
      className="position-editor"
    />
  );
};

export default MyEditor;