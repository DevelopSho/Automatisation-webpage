
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Entry from '../pages/Entry';
import Newsletter from '../pages/Newsletter';
import Tasks from '../pages/Tasks';
import Character from '../pages/Character';

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/character" element={<Character />} />
    
      </Routes>
    </BrowserRouter>
  );
};

export default App;