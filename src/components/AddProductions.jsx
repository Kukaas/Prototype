import { Form, Input, Button, DatePicker, InputNumber, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AddProductions = () => {
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

  if (!user) {
    return <Spin />;
  }

  const onFinish = async (values) => {
    try {
      const response = await axios.post('https://api-prototype-kukaas-projects.vercel.app/api/production', values);
      console.log('Response:', response); // Log response
      message.success('Production added successfully');
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error('Failed to add production:', error); // Log the error
    }
  };

  return (
    <div className="flex justify-center items-start h-screen bg-gray-200 overflow-auto">
      <Form
        name="addProduction"
        onFinish={onFinish}
        initialValues={{ status: 'IN_PROGRESS', userEmail: user.email }}
        className="bg-white p-8 rounded shadow-md w-full md:w-1/2 lg:w-1/3"
        layout="vertical"
      >
        <h2 className="text-center text-2xl font-bold mb-8">Edit Production</h2>
        <Form.Item
          label={<span className="font-bold text-lg">Product Type</span>}
          name="productType"
          rules={[{ required: true, message: 'Please select the product type!' }]}
          className="mb-2"
        >
          <Input className="rounded" placeholder="eg. Polo, Palda"/>
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-lg">Start Time</span>}
          name="startTime"
          rules={[{ required: true, message: 'Please select the start time!' }]}
          className="mb-2"
        >
          <DatePicker className="rounded w-full" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-lg">Unit Price</span>}
          name="unitPrice"
          rules={[{ required: true, message: 'Please input the unit price!' }]}
          className="mb-2"
        >
          <InputNumber min={1} className="rounded w-full" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-lg">Quantity</span>}
          name="quantity"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
          className="mb-2"
        >
          <InputNumber min={1} className="rounded w-full" placeholder="Quantity"/>
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-lg">Status</span>}
          name="status"
          className="mb-2"
        >
          <Input className="rounded" placeholder="IN_PROGRESS" disabled/>
        </Form.Item>

        <Form.Item
            label={<span className="font-bold text-lg">Email</span>}
            name="userEmail"
            className="mb-2"
        >
            <Input className="rounded" />
        </Form.Item>

        <Form.Item
        className="mb-2"
        >
          <Button type="primary" htmlType="submit" className="w-full rounded">
            Add Production
          </Button>
        </Form.Item>

        <Form.Item
          className="mb-2"
        >
          <Button type="default" onClick={() => navigate(`/profile/${id}`)} className="w-full rounded">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductions;