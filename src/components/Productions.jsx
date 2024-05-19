import  { useEffect, useState } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';


Productions.propTypes = {
  email: PropTypes.string.isRequired,
};

const Productions = ({ email }) => {
  const [productions, setProductions] = useState([]);

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

  return (
    <div>
      {productions.map((production) => (
        <div key={production.id}>
          <h2>{production.title}</h2>
          <p>{production.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Productions;