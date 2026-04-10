// frontend/src/pages/SplashPage.js
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const SplashPage = () => {
 const { user } = useAuth();
 return (
 <div className='splash-page'>
 <h1>Welcome to TheFolio</h1>
 <p>A community blog where members share ideas, stories, and
inspiration.</p>
 <div className='splash-actions'>
 <Link to='/home' className='btn-primary'>Browse Posts</Link>
 {!user && (
 <>
 <Link to='/register' className='btn-secondary'>Create
Account</Link>
 <Link to='/login' className='btn-secondary'>Login</Link>
 </>
 )}
 {user && (
 <Link to='/create-post' className='btn-secondary'>Write a Post</Link>
 )}
 </div>
 </div>
 );
};
export default SplashPage;