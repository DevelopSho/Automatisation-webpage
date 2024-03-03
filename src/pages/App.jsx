
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Entry from '../pages/Entry';
import Newsletter from '../pages/Newsletter';
import Tasks from '../pages/Tasks';
import Character from '../pages/Character';
import Pictures from '../pages/Pictures';
import CharacterForm from '../components/CharacterForm';
import CharacterDetail from '../pages/CharacterDetail';

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/character" element={<Character />} />
        <Route path="/pictures" element={<Pictures />} />
        <Route path="/characterform" element={<CharacterForm />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;