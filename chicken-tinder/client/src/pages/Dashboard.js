import { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { useCookies } from 'react-cookie';
import axios from 'axios';


const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [restaurants, setRestaurants] = useState(null);

    const userId = cookies.UserId

    const getUser = async () => { 
      try {
          const response = await axios.get('http://localhost:8000/user', {
              params: {userId}
          })
          setUser(response.data)
      } catch (error) {
          console.log(error)
      }
    }

    const getRestaurants = async (restaurant) => {
      try {
        const response = await axios.get('http://localhost:8000/get-restaurants', {
          params: { location: 'New York', term: 'restaurant' }
        });
    
        setRestaurants(response.data);
      } catch (error) {
        console.log(error);
      }
    };    

    useEffect(() => {
      getUser()
      getRestaurants()

    }, [])

    const createRestaurantObject = async (swipedRestaurant) => {
      try {
        const restaurantData = {
          restaurant_id: swipedRestaurant.restaurant_id,
          name: swipedRestaurant.name,
          location: swipedRestaurant.location,
          phone_number: swipedRestaurant.phone_number,
          isClosed: swipedRestaurant.isClosed,
          image_url: swipedRestaurant.image_url,
          categories: swipedRestaurant.categories,
          rating: swipedRestaurant.rating,
        };
    
        await axios.post('http://localhost:8000/create-restaurant', {
          restaurantData,
          userId: cookies.UserId,
        });
        console.log('Restaurant object created:', restaurantData);
      } catch (error) {
        console.error('Error creating restaurant object:', error);
      }
    };
    

    const swiped = (direction, swipedRestaurant) =>{
      if(direction === 'right') {
        createRestaurantObject(swipedRestaurant)
      }
      setLastDirection(direction)
    }
   
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
  }

    console.log('restaurants ', restaurants)
   
    return (
      <>
      {user &&
      <div className="dashboard"> 
          <div className="swipe-container">
              <div className="card-container">
              {restaurants?.map((restaurant) => {
                console.log('Rendering restaurant:', restaurant);
                return (
                  <TinderCard
                    className="swipe"
                    key={restaurant.restaurant_id}
                    onSwipe={(dir) => swiped(dir, restaurant)}
                    onCardLeftScreen={() => outOfFrame(restaurant && restaurant.name)}>
                    <div
                      style={{ backgroundImage: `url(${restaurant.image_url})` }}
                      className="card">
                      <h3>{restaurant.name}</h3>
                    </div>
                  </TinderCard>
                );
              })}
                  <div className="swipe-info">
                      {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                  </div>
              </div>
          </div>
      </div>}
    </>
    )
}

export default Dashboard