import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import LogoutButton from "../components/SignOut";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import "../styles/Postavy.css";  // Import CSS stylových pravidel

// Komponenta pro zobrazení postav
const Character = () => {
  const [characterData, setCharacterData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthday: "",
    city: "",
    gender: "",
    nationality: "",
    image: null,
  });
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const charactersRef = firebase.firestore().collection("characters");
        const snapshot = await charactersRef.get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCharacterData(data);

        const unsubscribe = charactersRef.onSnapshot((querySnapshot) => {
          const updatedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCharacterData(updatedData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Chyba při načítání dat z Firebase:", error);
      }
    };

    fetchData();
  }, []);

  const loadImageUrl = async (characterId) => {
    try {
      const storageRef = firebase.storage().ref();
      const imageUrlRef = storageRef.child(`images/${characterId}`);
      const imageUrl = await imageUrlRef.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.error("Chyba při načítání URL obrázku:", error);
      return null;
    }
  };

  useEffect(() => {
    if (loadingImages && characterData.length > 0) {
      const loadCharacterDataWithImages = async () => {
        const updatedData = await Promise.all(
          characterData.map(async (character) => {
            const imageUrl = await loadImageUrl(character.id);
            return { ...character, imageUrl };
          })
        );
        setCharacterData(updatedData);
        setLoadingImages(false);
      };

      loadCharacterDataWithImages();
    }
  }, [loadingImages, characterData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const image = files[0];
      setFormData({
        ...formData,
        image: image,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const charactersRef = firebase.firestore().collection("characters");
      const { name, surname, birthday, city, gender, nationality, image } = formData;

      const characterDocRef = await charactersRef.add({
        name,
        surname,
        birthday,
        city,
        gender,
        nationality,
      });

      if (image) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${characterDocRef.id}`);
        await imageRef.put(image);
        setLoadingImages(true);
      }

      // Resetovat formulář po odeslání
      setFormData({
        name: "",
        surname: "",
        birthday: "",
        city: "",
        gender: "",
        nationality: "",
        image: null,
      });

      console.log("Data byla úspěšně uložena do databáze.");
    } catch (error) {
      console.error("Chyba při ukládání dat:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const charactersRef = firebase.firestore().collection("characters");

      // Získat URL obrázku před smazáním
      const character = characterData.find((char) => char.id === id);
      const imageUrl = character.imageUrl;

      await charactersRef.doc(id).delete();
      console.log("Data byla úspěšně smazána.");

      // Smazat obrázek z Firebase Storage
      if (imageUrl) {
        const storageRef = firebase.storage().refFromURL(imageUrl);
        await storageRef.delete();
      }

      // Aktualizovat stav characterData
      setCharacterData((prevData) => prevData.filter((char) => char.id !== id));
    } catch (error) {
      console.error("Chyba při mazání dat:", error);
    }
  };

  return (
    <>
      <div className="tlacitko">
        <LogoutButton />
      </div>
      <Menu />

      <div className="vytvoreni-postavy">
        <h2>Vytvořit novou postavu</h2>
        <Form className="character-form" onSubmit={handleSubmit}>
          <Form.Group controlId="formImage">
            <Form.Label className="text-weight">Obrázek:</Form.Label>
            <Form.Control
              className="change-input"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
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
            <Form.Label className="text-weight">Město:</Form.Label>
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

          <Button variant="primary" type="submit">
            Vytvořit postavu
          </Button>
        </Form>
      </div>

     
<div className="seznam-postav">
  <h2 className="my-character">Charaktery postav</h2>
  <div className="firebase-data">
    {characterData && characterData.length > 0 ? (
      <div className="table-container"> {/* Nový div pro obalení tabulky */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Obrázek</th>
              <th>Jméno</th>
              <th>Příjmení</th>
              <th>Datum narození</th>
              <th>Město</th>
              <th>Pohlaví</th>
              <th>Národnost</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {characterData.map((character) => (
              <tr key={character.id}>
                <td>
                  {character.imageUrl && (
                    <img
                      src={character.imageUrl}
                      alt={`${character.name} ${character.surname}`}
                      className="character-image"
                    />
                  )}
                </td>
                <td>{character.name}</td>
                <td>{character.surname}</td>
                <td>{character.birthday}</td>
                <td>{character.city}</td>
                <td>{character.gender}</td>
                <td>{character.nationality}</td>
                <td>
                  <Button
                    variant="danger"
                    className="send-two"
                    onClick={() => handleDelete(character.id)}
                  >
                    Smazat
                  </Button>
                  <Link to={`/character/${character.id}`} className="btn btn-info ml-2">
                    Více informací
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    ) : (
      <p>Žádné dostupné postavy</p>
    )}
  </div>
</div>
    </>
  );
};

export default Character;