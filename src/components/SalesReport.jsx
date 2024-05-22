import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('https://api-prototype-kukaas-projects.vercel.app/api/sales-report')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);

    // Group data by productType
    const groupedData = data.reduce((acc, item) => {
        const { productType, totalRevenue } = item;
        if (!acc[productType]) {
            acc[productType] = { productType, totalRevenue: 0 };
        }
        acc[productType].totalRevenue += totalRevenue;
        return acc;
    }, {});

    // Convert grouped data object into an array suitable for recharts
    const formattedData = Object.values(groupedData);

    // Colors for the bars
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE'];

    return (
        <BarChart
            width={500}
            height={300}
            data={formattedData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
                dataKey="totalRevenue"
                name="Total Revenue"
                fill={(entry) => colors[formattedData.findIndex(item => item.productType === entry.productType) % colors.length]}
            />
        </BarChart>
    );
};

export default SalesReport;
