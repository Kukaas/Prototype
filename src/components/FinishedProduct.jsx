import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Select, Row, Col, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const FinishedProduct = () => {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://api-prototype-kukaas-projects.vercel.app/api/finished-product');
      setData(result.data);
    };

    fetchData();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api-prototype-kukaas-projects.vercel.app/api/finished-product/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));

      message.success('Finished product deleted successfully');
    } catch (error) {
      console.error('Failed to delete finished product:', error);
    }
  };

  const handleStatusChange = async (id) => {
    const status = selectedStatus[id];

    if (status) {
      const finishedProductToUpdate = data.find((prod) => prod.id === id);
      if (!finishedProductToUpdate) {
        message.error('Finished product not found');
        return;
      }

      const payload = {
        productType: finishedProductToUpdate.productType,
        unitPrice: finishedProductToUpdate.unitPrice,
        quantity: finishedProductToUpdate.quantity,
        status: status,
        totalCost: finishedProductToUpdate.totalCost,
      };

      console.log('Updating status with payload:', payload);

      try {
        await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/finished-product/${id}`, payload);

        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, status } : item))
        );
        message.success('Finished product updated successfully');
      } catch (error) {
        message.error('Failed to update finished product');
      }
    }
  };
  


  const columns = [
    {
      title: 'Product Type',
      dataIndex: 'productType',
      key: 'productType',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select 
          defaultValue={record.status} 
          onChange={(value) => setSelectedStatus({ ...selectedStatus, [record.id]: value })}
          disabled={record.status === "SOLD"}
        >
          
          <Option value="SOLD">SOLD</Option>
          <Option value="Available">SOLD </Option>
        </Select>
      ),

    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
    },
    {
      title: 'Production ID',
      dataIndex: ['production', 'id'],
      key: 'productionId',
    },
    {
      title: 'Assigned Employee',
      dataIndex: ['production', 'user', 'name'],
      key: 'userName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => handleStatusChange(record.id)}>Update</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </>
      ),
    },

  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="start">
        <Col>
            <Link onClick={() => navigate(-1)} className="text-blue-500 underline hover:text-blue-700 font-bold mb-4 text-lg">Back</Link>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Typography.Title level={1}>Finished Products</Typography.Title>
        </Col>
      </Row>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        pagination={{ pageSize: 4 }}
        scroll={{ x: 1000 }}
      />;
    </div>
  )
};

export default FinishedProduct;