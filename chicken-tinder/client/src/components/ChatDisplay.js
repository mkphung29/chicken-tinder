import Chat from './Chat';
import ChatInput from './ChatInput';
import axios from 'axios';
import { useState, useEffect } from 'react'; 

const ChatDisplay = ({ user , clickedRestaurant }) => {
    const userId = user?.user_id
    const clickedRestaurantId = clickedRestaurant?.restaurant_id
    const [usersMessages, setUsersMessages ] = useState(null)

    const getUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: userId, correspondingUserId: clickedRestaurantId}
            })
         setUsersMessages(response.data)
        } catch (error) {
         console.log(error)
     }
    }

    useEffect(() => {
        getUsersMessages()
    }, [])

    const messages = []

    usersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = user?.first_name
        formattedMessage['img'] = user?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <>
        <Chat descendingOrderMessages={descendingOrderMessages}/>
        <ChatInput
         user={user}
         clickedRestaurant={clickedRestaurant} getUserMessages={getUsersMessages}/>
        </>
    )
}

export default ChatDisplay