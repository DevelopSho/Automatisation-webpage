import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/storage';
import "../styles/CharacterDetail.css";

const CharacterDetail = () => {
  const { id } = useParams();
  const [characterData, setCharacterData] = useState(null);

  const loadImageUrl = async (imageName) => {
    try {
      const storageRef = firebase.storage().ref();
      const imageUrlRef = storageRef.child(`images/${imageName}`);
      const imageUrl = await imageUrlRef.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.error("Chyba při načítání URL obrázku:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const charactersRef = firebase.firestore().collection('characters');
        const doc = await charactersRef.doc(id).get();

        if (doc.exists) {
          const character = doc.data();

          // Získání názvu obrázku z načtených dat o postavě
          const imageName = character.imageUrl;

          // Odstranění případné přebytečné cesty ve jménu obrázku
          const imageNameWithoutPath = imageName.replace('images/', '');

          // Načti URL obrázku a aktualizuj state
          const imageUrl = await loadImageUrl(imageNameWithoutPath);
          setCharacterData({ ...character, imageUrl });
        } else {
          console.log('Dokument nenalezen.');
        }
      } catch (error) {
        console.error('Chyba při načítání dat:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!characterData) {
    return <p>Načítání...</p>;
  }

  return (
    <>
    <Link to={`/character/`} className="btn btn-primary">Zpět</Link>
      <div className="character-detail-container">
        <h2 className="detail-heading">Detail postavy</h2>
        
        <div className="character-image-container">
          {characterData.imageUrl && (
            <img src={characterData.imageUrl} alt="Postava" className="character-image" />
          )}
        </div>
    
        <div className="character-info">
          <div className="character-content">
            <p><strong>Jméno:</strong> {characterData.name}</p>
            <p><strong>Příjmení:</strong> {characterData.surname}</p>
            <p><strong>Datum narození:</strong> {characterData.birthday}</p>
            <p><strong>Místo bydliště:</strong> {characterData.city}</p>
            <p><strong>Pohlaví:</strong> {characterData.gender}</p>
            <p><strong>Národnost:</strong> {characterData.nationality}</p>
          </div>
          
          <p className="character-lore">Lore:</p>
          <div className="character-description" dangerouslySetInnerHTML={{ __html: characterData.description }}></div>

          <Link to={`/edit/${id}`} className="edit-button">Editovat postavu</Link>
        </div>
      </div>
    </>
  );
};

export default CharacterDetail;