import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Select, Row, Col, Typography, Modal } from 'antd';
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

  const updateSalesReport = async (productType, totalPrice) => {
    try {
      // Search for the product type
      const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/sales-report?type=${productType}`);
      const salesReports = await response.data;
  
      // If the product type exists
      if (salesReports.length > 0) {
        // Add the total price to the total revenue
        const totalRevenue = salesReports[0].totalRevenue + totalPrice;
  
        // Update the sales report
        const updateResponse = await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/sales-report/${salesReports[0].id}`, { totalRevenue });
  
        if (!updateResponse.ok) {
          throw new Error('Failed to update sales report');
        }
  
        message.success('Sales report updated successfully');
      } else {
        message.error('Product type not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInventoryItem = async (productType) => {
    try {
      // Search for the inventory item
      const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/inventory?type=${productType}`);
      const inventoryItems = await response.data;
  
      // If the inventory item exists
      if (inventoryItems.length > 0) {
        // Delete the inventory item
        const deleteResponse = await axios.delete(`https://api-prototype-kukaas-projects.vercel.app/api/inventory/${inventoryItems[0].id}`);
  
        if (deleteResponse.status < 200 || deleteResponse.status >= 300) {
          throw new Error('Failed to delete inventory item');
        }
        
        message.success('Inventory item deleted successfully');
      } else {
        message.error('Inventory item not found');
      }
    } catch (error) {
      console.error(error);
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

      try {
        await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/finished-product/${id}`, payload);

        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, status } : item))
        );
        message.success('Finished product updated successfully');

        // If the status is updated to 'SOLD', update the sales report
        if (status === 'SOLD') {
          await updateSalesReport(finishedProductToUpdate.productType, finishedProductToUpdate.totalCost);
          await deleteInventoryItem(finishedProductToUpdate.productType);
        }
      } catch (error) {
        console.error('Failed to update status:', error);
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
          <Option value="Available">AVAILABLE</Option>
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
          <Button 
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this item?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                  handleDelete(record.id);
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }} 
            danger
          >
            Delete
          </Button>
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