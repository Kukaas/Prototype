import { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Typography, Modal } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Inventory() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('https://api-prototype-kukaas-projects.vercel.app/api/inventory');
                console.log(response.data);
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items", error);
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://api-prototype-kukaas-projects.vercel.app/api/inventory/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };
    
    const handleUpdate = async (id, newValues) => {
        try {
            const response = await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/inventory/${id}`, newValues);
            setItems(items.map(item => item.id === id ? response.data : item));
        } catch (error) {
            console.error("Error editing item", error);
        }
    };

    const columns = [
        {   title: 'Product Type', 
            dataIndex: 'type', 
            id: 'type',
            width: 150
        },
        { title: 'Quantity', 
            dataIndex: 'quantity', 
            id: 'quantity',
            width: 100
        },
        {
            title: 'Actions',
            id: 'actions',
            width: 150,
            render: (text, record) => (
                <>
                    <Button onClick={() => handleUpdate(record.id)} style={{ marginRight: '10px' }} primary>Edit</Button>
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
                <Typography.Title level={1}>Inventory</Typography.Title>
                </Col>
            </Row>
            <Table 
                columns={columns} 
                dataSource={items} 
                rowKey="id"
                pagination={{ pageSize: 4 }}
                scroll={{ x: 1000 }}
            />
        </div>
    )

}

export default Inventory;