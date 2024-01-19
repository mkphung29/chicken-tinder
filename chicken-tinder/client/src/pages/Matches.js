import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import SideBar from '../components/SideBar';
import RestaurantItem from '../components/RestaurantItem';


const Matches = () => {

    const [matches, setMatches] = useState([]);

    const fetchMatches = async () => {
        try {
        const response = await fetch(`http://localhost:8000/api/get-matches/user_id_here`);
        const data = await response.json();
        setMatches(data);
        } catch (error) {
        console.error('Error fetching matches:', error);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    

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
                {/* You can also display the match date or other details */}
                </div>
            ))}
        </div>

       </div>
    )
}

export default Matches