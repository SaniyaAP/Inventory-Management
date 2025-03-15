import { Route, Routes } from 'react-router-dom';
import GuestLayout from './components/guestLayout/GuestLayout';
import AdminLayout from './components/adminLayout/AdminLayout';
import Home from './components/guestLayout/Home';
import Register from './components/guestLayout/Register';
import Login from './components/guestLayout/Login';
import About from './components/guestLayout/About';
import EditProfile from './components/guestLayout/EditProfile';
import ChangePassword from './components/guestLayout/ChangePassword';
import AdminForgotPassword from './components/adminLayout/AdminForgotPassword';
import Contact from './components/guestLayout/Contact';
import AdminChangePassword from './components/adminLayout/AdminChangePassword';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import './App.css';
import Categories from './components/adminLayout/Categories';
import { SubCategories } from './components/adminLayout/SubCategories';
import Items from './components/adminLayout/Items';
import Stock from './components/adminLayout/Stock';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<GuestLayout />}>
          <Route index element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgotPassword' element={<AdminForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/changePassword' element={<ChangePassword />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='/admin/categories' element={<Categories />} />
          <Route path='/admin/subCategories' element={<SubCategories />} />
          <Route path='/admin/items' element={<Items />} />
          <Route path='/admin/stock' element={<Stock />} />
          <Route path='/admin/edit-profile' element={<EditProfile />} />
          <Route path='/admin/change-password' element={<ChangePassword />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
