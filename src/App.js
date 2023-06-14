import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Detail from './pages/Detail';
import AddEditBlog from './pages/AddEditBlog';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './style.scss'
import './media-query.css'
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Auth from './pages/Auth';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null);
      }
    })
  }, [])

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null)
      setActive("login")
      navigate("/auth")
    })
  }
  return (
    <div className="App">
      <Header setActive={setActive} active={active} user={user} handleLogout={handleLogout} />
      <ToastContainer position='top-center' />
      <Routes>
        <Route path='/' element={user?<Home setActive={setActive} user={user} />:<Navigate to='/auth'/>} />
        <Route path='/detail/:id' element={user?<Detail setActive={setActive} />:<Navigate to='/auth'/>} />
        <Route path='/create' element={ user?<AddEditBlog user={user}/>:<Navigate to='/auth'/>} />
        <Route path='/update/:id' element={user?<AddEditBlog user={user} setActive={setActive}/>:<Navigate to='/auth'/>} />
        <Route path='/about' element={<About />} />
        <Route path='/auth' element={<Auth setActive={setActive} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
