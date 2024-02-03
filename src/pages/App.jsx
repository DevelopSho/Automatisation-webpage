import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Entry from '../pages/Entry';
import Newsletter from '../pages/Newsletter';
import Tasks from '../pages/Tasks';
import firebase from 'firebase/app';
import 'firebase/auth';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setAuthenticated(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        {authenticated ? (
          <>
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/tasks" element={<Tasks />} />
          </>
        ) : (
          // Pokud uživatel není přihlášen, přesměrujte jej na přihlašovací stránku
          <Navigate to="/" replace />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;