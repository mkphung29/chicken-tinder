const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Add cors middleware
const axios = require('axios');
require('dotenv').config();

const uri = 'mongodb+srv://maddykay396:dB5eF7zLX1xsV1Rj@cluster0.gkhmnx2.mongodb.net/?retryWrites=true&w=majority';

const app = express();

// Configure cors middleware
const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with the actual origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

app.use(express.json());

// Handle YELP API requests
app.route('/api/yelp/:city')
  .get(async (req, res) => {
    try {
      const { city } = req.params;
      const YELP_API_KEY = 'dSY2LQiIcIS28Vb_Do_DEw8l2lUXWGyr9aRvtsYsHtccfbQ3f2MHRcMyegAg2cIjL1ibJ4fupuf2LHMb-Cu0AzaQFffpKw1Fzy35wpDRfBb9jsIk57D8xe6ysYiMZXYx';

      const response = await axios.get(`https://api.yelp.com/v3/businesses/search`, {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          location: city,
          term: 'restaurants',
        },
      });

      const businesses = response.data.businesses;
      res.json(businesses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const { city } = req.params;
      const YELP_API_KEY = 'dSY2LQiIcIS28Vb_Do_DEw8l2lUXWGyr9aRvtsYsHtccfbQ3f2MHRcMyegAg2cIjL1ibJ4fupuf2LHMb-Cu0AzaQFffpKw1Fzy35wpDRfBb9jsIk57D8xe6ysYiMZXYx';

      const response = await axios.get(`https://api.yelp.com/v3/businesses/search`, {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          location: city,
          term: 'restaurants',
        },
      });

      const businesses = response.data.businesses;
      res.json(businesses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route to handle creating matched restaurants
app.post('/api/create-restaurant', async (req, res) => {
    const { restaurantData, userId } = req.body;
    const query = { user_id: userId };
    const updateDocument = {
    $push: {
        matches: {
        restaurant: restaurantData,
        date: new Date(),
        },
    },
    };
    const result = await users.updateOne(query, updateDocument);
});

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

// Fetch a user's matches
app.get('/api/get-matches/:userId', async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await users.findOne({ _id: userId });
      res.json(user.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


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

// Get user's restaurants from the database
app.get('/user-restaurants', async (req, res) => {
    const userId = req.query.userId;

    try {
        const client = new MongoClient(uri)
        await client.connect()

        const database = client.db('app-data')
        const restaurants = database.collection('restaurants')

        const userRestaurants = await restaurants.find({user_id: userId}.toArray())

        res.json(userRestaurants)
    }catch (error){
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'})
    } finally{
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


app.listen(PORT, () => console.log("Server running on PORT " + PORT))