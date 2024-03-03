import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Link } from 'react-router-dom';
import "../styles/CharacterMenu.css";
import MyEditor from './MyEditor';

const CharacterForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthday: '',
    city: '',
    gender: '',
    nationality: '',
    description: '',
    image: null,
  });

  const [editorContent, setEditorContent] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const charactersRef = firebase.firestore().collection('characters');
      const storageRef = firebase.storage().ref();

      const { name, surname, birthday, city, gender, nationality, image } = formData;

      if (image) {
        const imageRef = storageRef.child(`images/${image.name}`);
        await imageRef.put(image);
      }

      const characterDocRef = await charactersRef.add({
        name,
        surname,
        birthday,
        city,
        gender,
        nationality,
        description: editorContent,
      });

      const imageUrl = image ? `images/${image.name}` : null;
      if (imageUrl) {
        await characterDocRef.update({ imageUrl });
      }

      setFormData({
        name: '',
        surname: '',
        birthday: '',
        city: '',
        gender: '',
        nationality: '',
        description: '',
        image: null,
      });

      setEditorContent('');

      setSuccessMessage('Data byla úspěšně uložena do databáze.');

      onFormSubmit();
      console.log('Data byla úspěšně uložena do databáze.');
    } catch (error) {
      console.error('Chyba při ukládání dat:', error);
    }
  };

  return (
    <>
      <Link to="/character">
        <button className='back-button'>Zpět na seznam postav</button>
      </Link>

      <h1>Zde si můžeš vytvořit svoji postavu: </h1>

      <Form className="character-form" onSubmit={handleSubmit}>
        {/* Přidáno pole pro popis lore postavy */}
        <Form.Group controlId="formImage">
          <Form.Label className="text-weight">Obrázek:</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="formName">
          <Form.Label className="text-weight">Jméno:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formSurname">
          <Form.Label className="text-weight">Příjmení:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBirthday">
          <Form.Label className="text-weight">Datum narození:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formCity">
          <Form.Label className="text-weight">Místo bydliště:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formGender">
          <Form.Label className="text-weight">Pohlaví:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formNationality">
          <Form.Label className="text-weight">Národnost:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Přidáno pole pro popis lore postavy */}
      
          <MyEditor onEditorChange={handleEditorChange} className="position-editor" />
        <Button variant="primary" type="submit" className="create-character">
          Vytvořit postavu
        </Button>

        {/* Zobrazení úspěšného oznámení */}
        {successMessage && (
          <Alert variant="success" className="success-message">
            {successMessage}
          </Alert>
        )}
      </Form>
    </>
  );
};

export default CharacterForm;