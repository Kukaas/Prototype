import { useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api-prototype-kukaas-projects.vercel.app/api/user');
        setUsers(response.data);
      } catch (error) {
        message.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewProfile = (id, role) => {
    if (role === 'ADMIN') {
      navigate(`/profile/${id}`);
    } else {
      navigate(`/profile/${id}`);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'View Profile',
      key: 'viewProfile',
      render: (text, record) => (
        <Button onClick={() => handleViewProfile(record.id, record.role)}>View Profile</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default UserList;
