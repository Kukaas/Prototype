import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Button, message, Space, Row, Col, Typography, Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const AdminProductions = ({ role }) => {
  const [productions, setProductions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        let response;
            response = await axios.get(`https://api-prototype-kukaas-projects.vercel.app/api/production`);
            setProductions(response.data);
      } catch (error) {
        console.error('Failed to fetch productions:', error);
      }
    };
  
    fetchProductions();
  }, [role]);

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
      title: 'Assigned Employee',
      dataIndex: ['user', 'name'],
      key: 'userName',
      width: 200,
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
        </Space>
        
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
          <Typography.Title level={1}>Production</Typography.Title>
        </Col>
      </Row>
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

AdminProductions.propTypes = {
  role: PropTypes.string.isRequired,
};

export default AdminProductions;
