import { Typography, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const SalesReport = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

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

    // Color for each bar in the chart
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const date = moment(payload[0].payload.salesDate);
            const month = date.format('MMMM'); // Get the month name
            const year = date.format('YYYY'); // Get the year

            return (
                <div className="p-3 bg-white border border-gray-300 text-gray-700">
                    <p className="font-bold">{`Product Type: ${payload[0].payload.productType}`}</p>
                    <p>{`Total Revenue: ${payload[0].value}`}</p>
                    <p>{`Month: ${month} ${year}`}</p>
                </div>
            );
        }

        return null;
    };

    const CustomLegend = () => (
        <div className="flex justify-center">
            <ul className="flex">
                {formattedData.map((entry, index) => (
                    <li key={index} className="mr-3">
                        <span className="inline-block w-4 h-4 mr-1" style={{ backgroundColor: colors[index % colors.length] }}></span>
                        {entry.productType}
                    </li>
                ))}
            </ul>
        </div>
    );

    CustomTooltip.propTypes = {
        active: PropTypes.bool,
        payload: PropTypes.arrayOf(PropTypes.shape({
            payload: PropTypes.shape({
                productType: PropTypes.string,
                salesDate: PropTypes.string,
            }),
            value: PropTypes.number,
        })),
    };


    return (
    <div style={{ padding: 24 }}>
        <Row justify="start">
            <Col>
                <Link onClick={() => navigate(-1)} className="text-blue-500 underline hover:text-blue-700 font-bold mb-4 text-lg">Back</Link>
            </Col>
        </Row>
        <Row justify="center">
            <Col>
                <Typography.Title level={1}>Sales Report</Typography.Title>
            </Col>
        </Row>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={formattedData}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productType" />
                <YAxis domain={[0, 100000]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Bar dataKey="totalRevenue">
                    {formattedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
    );
};

export default SalesReport;
