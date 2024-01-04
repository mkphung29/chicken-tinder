import { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import { useCookies } from 'react-cookie';
import axios from 'axios';


const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [restaurants, setRestaurants] = useState(null);

    const userId = cookies.UserId

    const getUser = async () => { // this is to get a user to have a match
      try {
          const response = await axios.get('http://localhost:8000/user', {
              params: {userId}
          })
          setUser(response.data)
      } catch (error) {
          console.log(error)
      }
    }

    const getRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get-restaurants', {
          params: { location: 'New York', term: 'restaurant' }
        });
    
        setRestaurants(response.data.businesses);
      } catch (error) {
        console.log(error);
      }
    };    

    useEffect(() => {
      getUser()

    }, [])

    useEffect(() => {
      if(user) {
        getRestaurants();
      }
    }, [user])

    const createRestaurantObject = async (restaurantData) => {
      try {
        await axios.post('http://localhost:8000/create-restaurant', {
          restaurantData,
          userId,
        })
        console.log('Restaurant object created: ', restaurantData)
      } catch (error) {
        console.error('Error creating restaurant object: ', error)
      }
    }

    const swiped = (direction, swipedRestaurant) =>{
      if(direction === 'right') {
        createRestaurantObject(swipedRestaurant)
      }
      setLastDirection(direction)
    }

    const updateMatches = async (matchedUserId) => {
      try {
          await axios.put('http://localhost:8000/addmatch', {
            userId,  
            matchedUserId,
          });
          getUser();
      } catch (err) {
        console.log(err);
      }
   };
   
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
  }

    const matchedRestaurantIds = user ? user.matches.map(({ restaurant }) => restaurant.restaurant_id) : [];

    const filteredRestaurants = restaurants && restaurants.filter((restaurant) => !matchedRestaurantIds.includes(restaurant.restaurant_id));

    console.log('restaurants ', restaurants)
   
    return (
      <>
      {user &&
      <div className="dashboard"> 
          <ChatContainer user={user}/> //update with our name
          <div className="swipe-container">
              <div className="card-container">
                  {restaurants?.map((restaurant) =>
                      <TinderCard
                          className="swipe"
                          key={restaurant.id}
                          onSwipe = {(dir) => swiped(dir, restaurant)}
                          
                          onCardLeftScreen={() => outOfFrame(restaurant.name)}>
                          <div
                              style={{ backgroundImage: `url(${restaurant.image_url})` }}
                              className="card">
                              <h3>{restaurant.name}</h3>
                          </div>
                      </TinderCard>
                  )}
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