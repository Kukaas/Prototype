import { useEffect, useState } from 'react';
import { Button, Card, Spin, message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/user/${id}`);
        setUser(response.data);
      } catch (error) {
        message.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleEditProfile = () => {
    navigate(`/profile/edit/${id}`);
  };

  const handleAddProductions = () => {
    navigate(`/profile/production/${id}`);
  };

  return (
    <div style={{ padding: 24 }}>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700 font-bold mb-4 text-lg">Home</Link>
      {loading ? (
        <Spin />
      ) : (
        user && (
          <Card title={user.name}>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Position: {user.position}</p>
            <Button onClick={handleEditProfile}>Edit Profile</Button>
            <Button onClick={handleAddProductions}>Add Productions</Button>
          </Card>
        )
      )}
    </div>
  );
};

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Profile;