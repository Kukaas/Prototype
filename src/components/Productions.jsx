import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Button, message } from 'antd';
import PropTypes from 'prop-types';

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
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
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
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
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
      title: 'Update',
      key: 'update',
      render: (text, record) => (
        <Button onClick={() => handleUpdate(record.id)} disabled={record.status === 'COMPLETED'}>
          Update
        </Button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={productions} rowKey="id" />;
};

Productions.propTypes = {
  email: PropTypes.string.isRequired,
};

export default Productions;
