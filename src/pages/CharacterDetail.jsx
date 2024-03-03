import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

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
    <div>
      <h2>Detail postavy</h2>
      <p>Jméno: {characterData.name}</p>
      <p>Příjmení: {characterData.surname}</p>
      <p>Datum narození: {characterData.birthday}</p>
      <p>Místo bydliště: {characterData.city}</p>
      <p>Pohlaví: {characterData.gender}</p>
      <p>Národnost: {characterData.nationality}</p>

      {/* Přidáno pole pro lore postavy */}
      <p>Lore:</p><div dangerouslySetInnerHTML={{ __html: characterData.description }}></div>

      {/* Zobrazíme obrázek pouze pokud máme URL */}
      {characterData.imageUrl && (
        <div>
          <p>Obrázek:</p>
          <img src={characterData.imageUrl} alt="Postava" style={{ maxWidth: '150px' }} />
        </div>
      )}

      {/* Zde můžeš přidat další informace podle potřeby */}
    </div>
  );
};

export default CharacterDetail;