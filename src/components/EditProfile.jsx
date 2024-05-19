import { Form, Input, Button, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/user/${id}`);
        setUser(response.data);
      } catch (error) {
        message.error('Failed to load user data');
      }
    };

    fetchUser();
  }, [id]);

  const onFinish = async (values) => {
    try {
      await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/user/${id}`, values);
      message.success('Profile updated successfully');
      navigate(`/profile/${id}`);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (!user) {
    return <Spin />;
  }

  return (
    <Form
      name="editProfile"
      initialValues={user}
      onFinish={onFinish}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Position"
        name="position"
      >
        <Input disabled />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProfile;