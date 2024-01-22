import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import SearchBar from '../components/SearchBar';
import SideBar from '../components/SideBar';
import RestaurantItem from '../components/RestaurantItem';
import test from '../images/test.jpg';

const Discovery = () => {
    const [restaurantData, setRestaurantData] = useState([]);
    const [city, setCity] = useState("New York");
    const [price, setPrice] = useState("");

    

    const handleSearch = (selectedCity, selectedPrice) => {
        setCity(selectedCity);
        setPrice(selectedPrice);
    };


    const handleMatch = async (restaurant) => {
        try {
          await fetch('http://localhost:8000/api/create-restaurant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ restaurantData: restaurant, userId: 'user_id_here' }),
          });
      
          // Fetch updated matches after a match is created
          //fetchRestaurants();
        } catch (error) {
          console.error('Error matching restaurant:', error);
        }
    };

    const localRestaurants = [
        {
          name: "Beachside Bar",
          image_url:
            "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg",
          categories: ["Cafe", "Bar"],
          price: "$$",
          rating: 4.5,
          phone_number: "123-456-7890",
        },
        {
          name: "Benihana",
          image_url:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
          categories: ["Cafe", "Bar"],
          price: "$$",
          rating: 3.7,
          phone_number: "345-675-9990",
        },
        {
          name: "India's Grill",
          image_url:
            test,
          categories: ["Indian", "Bar"],
          price: "$$",
          rating: 4.9,
          phone_number: "677-420-8376",
        },
    ];

    useEffect(() => {
        const fetchRestaurants = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/yelp/${encodeURIComponent(city)}`, {
              method: 'GET',  
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            const data = await response.json();

            const filteredRestaurants = data.filter(restaurant => 
                price ? restaurant.price && restaurant.price.includes(price) : true
            );

            setRestaurantData(filteredRestaurants);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchRestaurants();
    }, [city, price]);

    return (
        <div>
            <div className="user-heading">
                <Nav minimal={true} setShowModal={() => {}} showModal={false} />
            </div>
            <div className="search">
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="tabs">
                <SideBar />
            </div>
            <div className="restaurant-items">
                {restaurantData.map((restaurant, index) => (
                <div className="items" key={index}>
                    <RestaurantItem restaurant={restaurant} />
                </div>
                ))}
            </div>
        </div>
    );
};

export default Discovery;
