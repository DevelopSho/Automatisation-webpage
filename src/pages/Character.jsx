import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import LogoutButton from "../components/SignOut";
import firebase from "firebase/app";
import "firebase/firestore";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../styles/NewStyle.css";  
import { MdOutlinePersonAddAlt1 } from "react-icons/md";



// Komponenta pro zobrazení postav
const Character = () => {
  const [characterData, setCharacterData] = useState([]);

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

  const handleDelete = async (id) => {
    try {
      const charactersRef = firebase.firestore().collection("characters");

      await charactersRef.doc(id).delete();
      console.log("Data byla úspěšně smazána.");
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
      <h2 className="my-character">Charaktery postav</h2>
      <Link to="/CharacterForm" className="bigger">
  <MdOutlinePersonAddAlt1 /> 
</Link>

      <div className="seznam-postav">
       
        <div className="firebase-data">
          {characterData && characterData.length > 0 ? (
            <div className="card-container"> 
              {characterData.map((character) => (
                <Card key={character.id} className="mb-3">
                  {/* Zde zobrazuji pouze jméno a příjmení */}
                  <Card.Body>
                    <Card.Title>{character.name} {character.surname}</Card.Title>
                    <div className="button-container">
                      <Button
                        variant="danger"
                        className="send-two"
                        onClick={() => handleDelete(character.id)}
                      >
                        Smazat
                      </Button>
                      <Link to={`/character/${character.id}`} className="btn btn-success ml-2">
                        Více informací
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-align">Žádné dostupné postavy</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Character;