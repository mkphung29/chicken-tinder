const PORT = 8000
const express = require('express')
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { searchYelp } = require('./yelpAPI'); 
require('dotenv').config()


const uri = 'mongodb+srv://maddykay396:dB5eF7zLX1xsV1Rj@cluster0.gkhmnx2.mongodb.net/?retryWrites=true&w=majority';

const app = express()
app.use(cors())
app.use(express.json())

// Default
app.get('/', (req, res) => {
    res.json('Hello to my app')
})

// Sign up to the database DON'T CHANGE
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password} = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    // send to database
    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({ email })
        
        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })

        res.status(201).json({token, userId: generatedUserId})

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Login in to the database DON'T CHANGE
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const{ email, password } = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({token, userId: user.user_id})
        }

        res.status(400).json('Invalid Credentials')

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }


})

// Get individual user (ourselves for our dashboard) DON'T CHANGE FOR NOW
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})

// Get restaurants from Yelp API
app.get('/get-restaurants', async (req, res) => {
    const { location, term } = req.query;

    try{
        // Make a request to Yelp API to get restuarnats
        // Use the 'location' and 'term' parameters as needed
        const response = await searchYelp(term, location)

        const restaurants = response.map(restaurant => ({
            restaurant_id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location.address1,
            phone_number: restaurant.display_phone,
            price: restaurant.price,
            isClosed: restaurant.is_closed,
            image_url: restaurant.image_url,
            categories: restaurant.categories.map(category => category.title),
            rating: restaurant.rating,
        }));

        res.json(restaurants)

    } catch (error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// POST the restaurant into the database once the user matches with it
app.post('/create-restaurant', async (req, res) => {
    const { restaurantData, userId } = req.body
    const client = new MongoClient(uri);

    try{
        await client.connect()
        const database = client.db('app-data')
        const restaurants = database.collection('restaurants')

        const result = await restaurants.insertOne(restaurantData);

        res.status(201).json({message: "Restaurant created successfully", restaurantId: result.insertedId})
    }catch (error){
        console.error('Error creating restaurant: ', error)
        res.status(500).json({error: 'Internal Server Error'})
    } finally {
        await client.close()
    }
})

// Update a user in the database through onboarding 
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: formData.user_id}

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                url: formData.url,
                about: formData.about,
                matches: formData.matches,
                gender_identity: formData.gender_identity
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// Update user with a match to a restaurant
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const { userId, restaurantData } = req.body;  // Use req.body consistently

        const query = { user_id: userId };
        const updateDocument = {
            $push: { matches: { restaurant: restaurantData } }
        };

        const result = await users.updateOne(query, updateDocument);

        res.json({ message: "Match added successfully", result });
    } catch (error) {
        console.error('Error adding match: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

/*
// Get all users by userIds in the database
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)

    } finally {
        await client.close()
    }
})*/

// Add a review to our Database
app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log("Server running on PORT " + PORT))