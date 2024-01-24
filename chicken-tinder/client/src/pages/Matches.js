import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import SideBar from '../components/SideBar';
import RestaurantItem from '../components/RestaurantItem';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Matches = () => {

    const [matches, setMatches] = useState([]);

    const { userId } = useParams();

    // Fetch user information 
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/user/${userId}`);
            const userData = response.data;
            // You can use userData if needed
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
    }, [userId]);

    const fetchMatches = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/get-matches/${userId}`);
            const data = await response.json();
            setMatches(data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [userId]);

    return (
        <div>
        <div className="user-heading">
            <Nav
                minimal={true} 
                setShowModal={() => {}} 
                showModal={false} 
            />
        </div>
        <div className="title">
            <h1>Madison's Matches</h1>
        </div>
        <div className="tabs">
            <SideBar />
        </div>
        <div className="restaurant-items">
            {/* Render matches */}
            {matches.map((match, index) => (
                <div className="items" key={index}>
                <RestaurantItem restaurant={match.restaurant} />
                </div>
            ))}
        </div>

       </div>
    )
}

export default Matches