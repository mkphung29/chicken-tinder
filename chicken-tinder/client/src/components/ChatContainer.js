import ChatHeader from './ChatHeader';
import MatchesDisplay from './MatchesDisplay';
import ChatDisplay from './ChatDisplay';
import { useState } from 'react';

const ChatContainer = ({ user }) => {
    const [clickedRestaurant, setClickedRestaurant ] = useState(null)

    return (
        <div className="chat-container">
            <ChatHeader user={user}/>

            <div>
                <button className="option" onClick={() => setClickedRestaurant(null)}>Matches</button>
                <button className="option" disabled={!clickedRestaurant}>Reviews</button>
            </div>

            {!clickedRestaurant && <MatchesDisplay matches={user.matches} setClickedRestaurant={setClickedRestaurant}/>}

            {clickedRestaurant && <ChatDisplay user={user} clickedRestaurant={clickedRestaurant}/>}
        </div>
    )
}

export default ChatContainer