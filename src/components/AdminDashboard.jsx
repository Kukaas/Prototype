import { useEffect, useState } from 'react';
import { Button, Card, Spin, message, Row, Col, Descriptions, Space, Typography } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

import AdminProductions from './AdminProductions';

const AdminDashboard = () => {
  const [user, setUser ] = useState(null);
//   const [ setProductions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();


//   useEffect(() => {
//     const fetchProductions = async () => {
//       try {
//         let response;
//         if (user.role === 'ADMIN') {
//           response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/production`);
//         } else {
//           response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/production/email/${user.email}`);
//         }
//         setProductions(response.data);
//       } catch (error) {
//         console.error('Failed to fetch productions:', error);
//       }
//     };
  
//     fetchProductions();
//   });

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


  return (
    <div style={{ padding: 24 }}>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700 font-bold mb-4 text-lg">Home</Link>
      {loading ? (
        <Spin />
      ) : (
        user && (
          <>
            <Row justify="center" style={{ marginTop: '2rem' }}>
              <Col xs={24} sm={24} md={20} lg={20} xl={18}>
                <Card 
                  title={user.name} 
                  style={{ borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Birth Date">{moment(user.birthDate).format('MMMM D, YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
                  </Descriptions>

                  <Space size="middle">
                    <Button 
                      type="primary" 
                      onClick={handleEditProfile} 
                      style={{ borderRadius: '5px' }}
                    >
                      Edit Profile
                    </Button>
                  </Space>
                  <Typography.Title level={2} style={{ textAlign: 'center', marginTop: '2rem' }}>Productions</Typography.Title>
                    <AdminProductions user={user} />
                </Card>
              </Col>
            </Row>
          </>
        )
      )}
    </div>
  );
};

AdminDashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AdminDashboard;