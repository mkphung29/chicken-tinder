import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const MatchesDisplay = ({ restaurants, setClickedRestaurant }) => {
    const [userRestaurants, setUserRestaurants] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(null);

    const getUserRestaurants = async () => {
        try {
          const response = await axios.get("http://localhost:8000/user-restaurants", {
            params: { userIds: cookies.UserId },
          });
          setUserRestaurants(response.data);
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        getUserRestaurants();
    }, []);
    

    return (
        <div className="matches-display">
          {userRestaurants?.map((restaurant, index) => (
            <div
              key={index}
              className="match-card"
              onClick={() => setClickedRestaurant(restaurant)}
            >
              <div className="img-container">
                <img src={restaurant?.url} alt={restaurant?.name + " profile"} />
              </div>
              <h3>{restaurant?.name}</h3>
            </div>
          ))}
        </div>
    );
};

export default MatchesDisplay;