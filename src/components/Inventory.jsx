import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

function Inventory() {
    const [items, setItems] = useState([]);

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

    const deleteItem = async (id) => {
        try {
            await axios.delete(`https://api-prototype-kukaas-projects.vercel.app/api/inventory/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };
    
    const editItem = async (id, newValues) => {
        try {
            const response = await axios.put(`https://api-prototype-kukaas-projects.vercel.app/api/inventory/${id}`, newValues);
            setItems(items.map(item => item.id === id ? response.data : item));
        } catch (error) {
            console.error("Error editing item", error);
        }
    };

    const columns = [
        { 
            title: 'ID',
            dataIndex: 'id', 
            id: 'id',
            width: 150
        },
        {   title: 'Type', 
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
                    <Button onClick={() => editItem(record.id)} style={{ marginRight: '10px' }} primary>Edit</Button>
                    <Button onClick={() => deleteItem(record.id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Table 
                columns={columns} 
                dataSource={items} 
                rowKey="id"
                pagination={{ pageSize: 4 }}
                scroll={{ x: 1000 }}
            />
        </>
    )

}

export default Inventory;