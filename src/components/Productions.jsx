import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Button, message, Space } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const Productions = ({ email }) => {
  const [productions, setProductions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/production/email/${email}`);
        setProductions(response.data);
      } catch (error) {
        console.error('Failed to fetch productions:', error);
      }
    };

    fetchProductions();
  }, [email]);

  //DELETE production
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api-prototype-kukaas-projects.vercel.app/api/production/${id}`);
  
      setProductions((prevProductions) =>
        prevProductions.filter((production) => production.id !== id)
      );
  
      message.success('Production deleted successfully');
    } catch (error) {
      console.error('Failed to delete production:', error);
      message.error('Failed to delete production');
    }
  };


  //UPDATE production
  const handleUpdate = async (id) => {
    const status = selectedStatus[id];
    if (status) {
      const productionToUpdate = productions.find(prod => prod.id === id);
      if (!productionToUpdate) {
        message.error('Production not found');
        return;
      }

      const payload = {
        productType: productionToUpdate.productType,
        unitPrice: productionToUpdate.unitPrice,
        quantity: productionToUpdate.quantity,
        status: status,
        userEmail: email,
      };

      console.log('Updating status with payload:', payload);

      try {
        await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/production/${id}`, payload);

        setProductions((prevProductions) =>
          prevProductions.map((production) =>
            production.id === id ? { ...production, status } : production
          )
        );

        message.success('Status updated successfully');
      } catch (error) {
        console.error('Failed to update status:', error);
        message.error('Failed to update status');
      }
    } else {
      message.error('Please select a status before updating');
    }
  };

  const columns = [
    {
      title: 'Product Type',
      dataIndex: 'productType',
      key: 'productType',
      width: 150,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 200,
      render: (startTime) => moment(startTime).format('MMMM DD, YYYY hh:mm A'),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 180 }}
          onChange={(value) => setSelectedStatus({ ...selectedStatus, [record.id]: value })}
          disabled={record.status === 'COMPLETED'}
        >
          <Select.Option value="PATTERN_MAKING">PATTERN_MAKING</Select.Option>
          <Select.Option value="CUTTING">CUTTING</Select.Option>
          <Select.Option value="SEWING">SEWING</Select.Option>
          <Select.Option value="ASSORTING">ASSORTING</Select.Option>
          <Select.Option value="COMPLETED">COMPLETED</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdate(record.id)} disabled={record.status === 'COMPLETED'}>
            Update
          </Button>
          <Button 
            onClick={() => handleDelete(record.id)} 
            disabled={record.status === 'COMPLETED'}  
            danger 
            style={{ 
              color: record.status !== 'COMPLETED' ? '#ff4d4f' : ''
            }}          
          >
            Delete
          </Button>
        </Space>
        
      ),
    },
  ];

  return (
    <div className="productions-table-container">
      <Table
        columns={columns}
        dataSource={productions}
        rowKey="id"
        pagination={{ pageSize: 4 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

Productions.propTypes = {
  email: PropTypes.string.isRequired,
};

export default Productions;
