import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect } from 'react';
import "../styles/CharacterMenu.css";

const MyEditor = ({ onEditorChange, initialContent }) => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    // Inicializace obsahu editoru na základě předaného popisu postavy
    if (initialContent) {
      setEditorContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (content) => {
    // Obsluha změn obsahu editoru
    setEditorContent(content);
    onEditorChange(content); // Předáváme obsah editoru do nadřazené komponenty
  };

  const handleFormSubmit = () => {
    // Přidáte zde kód pro odeslání obsahu editoru (případně do Firebase nebo jiného úložiště)

    // Resetování obsahu editoru po odeslání
    setEditorContent('');
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={editorContent}
        onChange={handleChange}
        className="position-editor"
      />

      {/* Tlačítko pro odeslání formuláře */}
      {/* Zde můžete přidat další funkcionalitu pro odeslání, pokud potřebujete */}
    </div>
  );
};

export default MyEditor;