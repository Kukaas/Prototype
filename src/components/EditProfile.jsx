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
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <Form
        name="editProfile"
        initialValues={user}
        onFinish={onFinish}
        className="bg-white p-8 rounded shadow-md"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
          className="mb-4"
        >
          <Input className="rounded" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
          className="mb-4"
        >
          <Input className="rounded" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          className="mb-4"
        >
          <Input disabled className="rounded" />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          className="mb-4"
        >
          <Input disabled className="rounded" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full rounded">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;