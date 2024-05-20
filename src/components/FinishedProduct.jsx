import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const FinishedProduct = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://api-prototype-kukaas-projects.vercel.app/api/finished-product');
      setData(result.data);
    };

    fetchData();
  }, []);

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
      dataIndex: 'productionId',
      key: 'productionId',
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default FinishedProduct;