import { useEffect, useState } from 'react';
import { Button, Card, Spin, message, Row, Col, Descriptions, Space, Typography } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Productions from './Productions';
import moment from 'moment';

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
        console.log(response.data.role); 
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

  const handleViewProductions = () => {
    navigate(`/profile/admin/productions`);
  };

  const handleViewFinishedProducts = () => {
    navigate(`/profile/admin/finished-products`);
  }

  const handleViewInvenotry = () => {
    navigate(`/profile/admin/inventory`);
  }

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
                    {user.role !== 'ADMIN' && (
                      <Button 
                        type="default" 
                        onClick={handleAddProductions} 
                        style={{ borderRadius: '5px' }}
                      >
                        Add Productions
                      </Button>
                    )}

                  </Space>
                  {user.role === 'ADMIN' ? (
                      <Typography.Title level={2} style={{ textAlign: 'center', marginTop: '2rem' }}>
                        Menu
                      </Typography.Title>
                    ) : (
                      <Typography.Title level={2} style={{ textAlign: 'center', marginTop: '2rem' }}>
                        Productions
                      </Typography.Title>
                  )}

                  {user.role === 'ADMIN' ? (
                    <>
                      <Button 
                        type="default" 
                        onClick={handleViewProductions} 
                        style={{ borderRadius: '5px', marginTop: '1rem' }}
                      >
                        View All Productions
                      </Button>

                      <Button 
                      type="default" 
                      onClick={handleViewFinishedProducts} 
                      style={{ borderRadius: '5px', marginTop: '1rem' }}
                      >
                      View Finished Products
                      </Button>

                      <Button 
                      type="default" 
                      onClick={handleViewInvenotry} 
                      style={{ borderRadius: '5px', marginTop: '1rem' }}
                      >
                      View inventory
                      </Button>
                    </>
                  ) : (
                    <Productions email={user.email} />
                  )}
                </Card>
              </Col>
            </Row>
          </>
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
