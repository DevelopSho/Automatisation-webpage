import { Link} from 'react-router-dom';
import "../styles/Menu.css"

const Menu = () => {
  return (
    <div>
      <nav className="menu">
        <ul className="position">
          <li><Link to="/newsletter" className="decoration">Novinky</Link></li>
          <li><Link to="/tasks" className="decoration">Úkoly</Link></li>
          <li><Link to="/character" className="decoration">Charaktery</Link></li>
          <li><Link to="/pictures" className="decoration">Fotogalerie</Link></li>
          {/* Další odkazy */}
        </ul>
      </nav>
    </div>
  );
}

export default Menu;