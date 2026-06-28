import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "./base/Api";

const Hello: React.FC = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/hello')
            .then(response => setMessage(response.data))
            .catch(error => console.error('There was an error!', error));
    }, []);

    return <h1>{message}</h1>;
};

export default Hello;