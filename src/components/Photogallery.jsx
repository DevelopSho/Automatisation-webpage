import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/PhotoGalleryUploader.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    // Načti seznam obrázků po načtení komponenty
    loadImages();
  }, []);

  const storage = firebase.storage();

  const loadImages = () => {
    // Načti seznam obrázků z Firebase Storage
    const storageRef = storage.ref();
    storageRef.child('Photogallery').listAll().then((result) => {
      const images = result.items.map((item) => {
        return item.getDownloadURL();
      });
      Promise.all(images).then((urls) => {
        setImageList(urls);
      });
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Nahraj obrázek na Firebase Storage
    const uploadTask = storage.ref(`Photogallery/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Pokud potřebuješ sledovat průběh nahrávání, můžeš sem přidat kód
      },
      (error) => {
        console.error(error);
      },
      () => {
        // Po úspěšném nahrání aktualizuj seznam obrázků
        loadImages();
      }
    );
  };

  const handleDelete = (imageUrl) => {
    // Smaž obrázek z Firebase Storage
    const imageRef = storage.refFromURL(imageUrl);
    imageRef.delete().then(() => {
      // Po úspěšném smazání aktualizuj seznam obrázků
      loadImages();
    }).catch((error) => {
      console.error(error);
    });
  };

  const openModal = (imageUrl, index) => {
    setModalImageUrl(imageUrl);
    setModalImageIndex(index);
  };

  const closeModal = () => {
    setModalImageUrl(null);
    setModalImageIndex(0);
  };

  return (
    <div className="image-uploader-container">
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Nahrát obrázek</button>

      <div className="image-list">
        {imageList.map((imageUrl, index) => (
          <div key={index} className="image-thumbnail">
            <img src={imageUrl} alt={`img-${index}`} onClick={() => openModal(imageUrl, index)} />
            <button className="delete-button" onClick={() => handleDelete(imageUrl)}>Smazat</button>
          </div>
        ))}
      </div>

      {modalImageUrl && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <Slider initialSlide={modalImageIndex}>
              {imageList.map((imageUrl, index) => (
                <div key={index}>
                  <img src={imageUrl} alt={`img-${index}`} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;