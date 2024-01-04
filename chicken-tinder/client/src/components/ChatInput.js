import { useState } from 'react';
import axios from 'axios'

const ChatInput = ({ user, clickedRestaurant, getUserMessages }) => {
    const [textArea, setTextArea] = useState("")
    const userId = user?.user_id
    const clickedRestaurantId = clickedRestaurant?.restaurant_id

    const addMessage = async () => {
        const message = {
            timestamp: new Date().toISOString(),
            from_userid: userId,
            to_restaurantid: clickedRestaurantId,
            review: textArea
        }

        try {
            await axios.post('http://localhost:8000/message', { message })
            getUserMessages()
            setTextArea("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="chat-input">
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage}>Submit</button>
        </div>
    )
}

export default ChatInput