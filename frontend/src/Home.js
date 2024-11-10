import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [name, setName] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080', { withCredentials: true })
            .then(res => {
                if(res.data.login)
                {
                    

                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login'); // Redirect to login page if request fails
            });
    }, []);

    return (
        <div>
            welcome {name}
        </div>
    );
}

export default Home;
