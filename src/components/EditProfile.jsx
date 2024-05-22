import { Form, Input, Button, message, Spin, DatePicker, ConfigProvider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import en_US from 'antd/es/locale/en_US';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/user/${id}`);
        setUser(response.data);

        // Convert user.birthDate to a moment object
        const initialValues = {
          ...response.data,
          birthDate: response.data.birthDate ? moment(response.data.birthDate) : null,
        };

        setInitialValues(initialValues);

      } catch (error) {
        message.error('Failed to load user data');
      }
    };

    fetchUser();
  }, [id]);

  if (!initialValues) {
    return <Spin />;
  }

  const onFinish = async (values) => {
    try {
      // Convert birthDate to a string
      const updatedValues = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      };
      
      await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/user/${id}`, updatedValues);
      message.success('Profile updated successfully');
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error(error); // Log the error to the console
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
        initialValues={initialValues}
        onFinish={onFinish}
        className="bg-white p-8 rounded shadow-md w-1/3"
      >
        <h2 className="text-center text-2xl font-bold mb-8">Edit Profile</h2>
        <Form.Item
          label="Name"
          name="name"
          className="mb-4"
        >
          <Input className="rounded" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          className="mb-4"
        >
          <Input className="rounded" />
        </Form.Item>

        <Form.Item
        label="BirthDate"
        name="birthDate"
        className="mb-4"
      >
        <ConfigProvider locale={en_US}>
          <DatePicker className="rounded w-full"/>
        </ConfigProvider>
      </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          className="mb-4"
        >
          <Input className="rounded" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          className="mb-4"
        >
          <Input.Password className="rounded" />
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

        <Form.Item>
          <Button type="default" onClick={() => navigate(user.role === 'ADMIN' ? `/profile/${id}` : `/profile/production/${id}`)} className="w-full rounded">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;