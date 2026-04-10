// frontend/src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const handleLogout = () => {
 logout();
 navigate('/');
 };
 return (
 <nav className='navbar'>
 <div className='navbar-brand'>
 <Link to='/'>TheFolio</Link>
 </div>
 <div className='navbar-links'>
 <Link to='/home'>Home</Link>
 {!user && (
 <>
 <Link to='/login'>Login</Link>
 <Link to='/register'>Register</Link>
 </>
 )}
 {user && (
 <>
 <Link to='/create-post'>Write Post</Link>
 <Link to='/profile'>Profile</Link>
 {user.role === 'admin' && <Link to='/admin'>Admin</Link>}
 <button onClick={handleLogout}
className='btn-logout'>Logout</button>
 </>
 )}
 </div>
 </nav>
 );
};
export default Navbar;