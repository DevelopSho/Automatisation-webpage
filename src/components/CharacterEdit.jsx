import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Form, Button, Alert } from 'react-bootstrap';
import MyEditor from './MyEditor';
import "../styles/CharacterEdit.css"

const CharacterEdit = () => {
  const { id } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthday: '',
    city: '',
    gender: '',
    nationality: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const charactersRef = firebase.firestore().collection('characters');
        const doc = await charactersRef.doc(id).get();

        if (doc.exists) {
          const character = doc.data();
          setCharacterData(character);
          setFormData({
            name: character.name,
            surname: character.surname,
            birthday: character.birthday,
            city: character.city,
            gender: character.gender,
            nationality: character.nationality,
            description: character.description,
          });
        } else {
          console.log('Dokument nenalezen.');
        }
      } catch (error) {
        console.error('Chyba při načítání dat:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      description: content,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const charactersRef = firebase.firestore().collection('characters');
      await charactersRef.doc(id).update({
        name: formData.name,
        surname: formData.surname,
        birthday: formData.birthday,
        city: formData.city,
        gender: formData.gender,
        nationality: formData.nationality,
        description: formData.description,
      });

      console.log('Postava byla úspěšně aktualizována.');
      setSuccessMessage('Postava byla úspěšně aktualizována.');

      setTimeout(() => {
        window.location.href = `/character/${id}`;
      }, 200);
    } catch (error) {
      console.error('Chyba při aktualizaci dat:', error);
    }
  };

  return (
    <div className="character-edit-container">
      <h2 className="edit-heading">Editace postavy</h2>
      <Form onSubmit={handleEditSubmit}>
        <Form.Group controlId="formName">
          <Form.Label className="text-weight">Jméno:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formSurname">
          <Form.Label className="text-weight">Příjmení:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formBirthday">
          <Form.Label className="text-weight">Datum narození:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formCity">
          <Form.Label className="text-weight">Místo bydliště:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formGender">
          <Form.Label className="text-weight">Pohlaví:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formNationality">
          <Form.Label className="text-weight">Národnost:</Form.Label>
          <Form.Control
            className="change-input"
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
          />
        </Form.Group>

        <MyEditor initialContent={formData.description} onEditorChange={handleEditorChange} />
        
        <Button variant="primary" type="submit" className="create-character">
          Uložit změny
        </Button>

        {successMessage && (
          <Alert variant="success" className="success-message">
            {successMessage}
          </Alert>
        )}
      </Form>

      <Link to={`/character/${id}`} className="back-to-detail">
        Zpět na detail postavy
      </Link>
    </div>
  );
};

export default CharacterEdit;