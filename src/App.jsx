import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';
import Profile from './components/Profile'; 
import EditProfile from './components/EditProfile';
import AddProductions from './components/AddProductions'

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/edit/:id" element={<EditProfile />} />
          <Route path="/profile/production/:id" element={<AddProductions />} />
          <Route path="/" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
