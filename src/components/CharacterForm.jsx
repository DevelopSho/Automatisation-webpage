import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Link } from 'react-router-dom';
import MyEditor from './MyEditor';
import "../styles/CharacterForm.css";

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
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevData => ({
      ...prevData,
      image: file,
    }));
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const charactersRef = firebase.firestore().collection('characters');
      const storageRef = firebase.storage().ref();

      const { name, surname, birthday, city, gender, nationality, image } = formData;

      if (!image) {
        // Zobrazit chybovou zprávu, pokud není vybrán soubor obrázku
        setErrorMessage('Nebyl vybrán žádný soubor!');
        return;
      }

      const imageRef = storageRef.child(`images/${image.name}`);
      await imageRef.put(image);

      const characterDocRef = await charactersRef.add({
        name,
        surname,
        birthday,
        city,
        gender,
        nationality,
        description: editorContent,
      });

      const imageUrl = `images/${image.name}`;
      await characterDocRef.update({ imageUrl });

      resetForm();

      setSuccessMessage('Data byla úspěšně uložena do databáze.');
      setErrorMessage(null);

      onFormSubmit();
      console.log('Data byla úspěšně uložena do databáze.');
    } catch (error) {
      console.error('Chyba při ukládání dat:', error);
    }
  };

  return (
    <>
      <Link to="/character">
        <button className='back-button-second'>Zpět na seznam postav</button>
      </Link>

      <h1 className="change-position">Zde si můžeš vytvořit svoji postavu: </h1>

      <Form className="character-form-container" onSubmit={handleSubmit}>
        <Form.Group controlId="formImage" className="form-group-custom">
          <Form.Label className="text-weight">Obrázek:</Form.Label>
          <Form.Control
            className="input-field"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="formName" className="form-group-custom">
          <Form.Label className="text-weight">Jméno:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formSurname" className="form-group-custom">
          <Form.Label className="text-weight">Příjmení:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBirthday" className="form-group-custom">
          <Form.Label className="text-weight">Datum narození:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formCity" className="form-group-custom">
          <Form.Label className="text-weight">Místo bydliště:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formGender" className="form-group-custom">
          <Form.Label className="text-weight">Pohlaví:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formNationality" className="form-group-custom">
          <Form.Label className="text-weight">Národnost:</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </Form.Group>

        <MyEditor onEditorChange={handleEditorChange} className="position-editor" />

        <Button variant="primary" type="submit" className="submit-button">
          Vytvořit postavu
        </Button>

        {errorMessage && (
          <Alert variant="danger" className="error-message">
            {errorMessage}
          </Alert>
        )}

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