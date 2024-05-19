import { Form, Input, Button, DatePicker, InputNumber, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form
        name="addProduction"
        onFinish={onFinish}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <Form.Item
          label="Product Type"
          name="productType"
          rules={[{ required: true, message: 'Please select the product type!' }]}
        >
          <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="eg. Polo, Palda"/>
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="startTime"
          rules={[{ required: true, message: 'Please select the start time!' }]}
        >
          <DatePicker showTime className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </Form.Item>

        <Form.Item
          label="Unit Price"
          name="unitPrice"
          rules={[{ required: true, message: 'Please input the unit price!' }]}
        >
          <InputNumber min={0} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
        >
          <InputNumber min={1} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValues={{ status: 'IN_PROGRESS' }}
        >
          <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="IN_PROGRESS" disabled/>
        </Form.Item>

        <Form.Item
            label="Email"
            name="userEmail"
            rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
        >
            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="eg. john@example.com"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Production
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductions;