import React from 'react';
import Menu from "../components/Menu";
import LogoutButton from "../components/SignOut";
import PhotoGallery from "../components/Photogallery"

const Pictures = () => {
  return (
    <>
      <div className="tlacitko">
        <LogoutButton />
      </div>
      <Menu />
      <h3>Nahrávání obrázku do fotogalerie</h3>
      <PhotoGallery />
  
    </>
  );
};

export default Pictures;