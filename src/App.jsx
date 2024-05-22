import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Profile from './components/Profile'; 
import EditProfile from './components/EditProfile';
import AddProductions from './components/AddProductions'
import UserList from './components/UserList';
import AdminDashboard from './components/AdminDashboard';
import AdminProductions from './components/AdminProductions';
import FinishedProduct from './components/FinishedProduct';
import Inventory from './components/Inventory';
import SalesReport from './components/SalesReport';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/profile/:id"  element={<Profile />}/>
          <Route path="profile-admin/:id" element={<AdminDashboard />}/> 
          <Route path="/profile/admin/productions" element={<AdminProductions />} /> 
          <Route path="/profile/admin/inventory" element={<Inventory />} />  
          <Route path="/profile/admin/sales-report" element={<SalesReport />} />
          <Route path="/profile/admin/finished-products" element={<FinishedProduct />}/>
          <Route path="/profile/edit/:id" element={<EditProfile />} />
          <Route path="/profile/production/:id" element={<AddProductions />} />       
          <Route path="/" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
