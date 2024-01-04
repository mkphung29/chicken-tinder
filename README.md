# Chicken Tinder: Decide Your Dinner

Chicken Tinder is a web app that allows users to discover restaurants in the NYC area. Users can match with new restaurants they like and leave reviews for them after going there. Reviews let users document their experience at a particular restaurant and help users decide whether they would come back. 

## How it works

First, users can either sign up or log into into their account. If users need to create an account, they will be taken to an onboarding page where they can fill out their basic account information. 

Then, users can start swiping! Similar to Tinder's user interface, users can "swipe" right on restaurants that interest them or "swipe" left to pass on a restaurant. Restaurants that users swipe right on appear in their match history. After eating at a restaurant, users can leave a personal review of their experience with the restaurant. 

## Features
- Tinder-like user interface with swipeable cards displaying NYC restaurants
- Integration with Yelp API to fetch and display restaurant data
- User authentication and authorization using JWT (JSON Web Tokens)
- User profile management with onboarding information
- Backend API development using Node.js Express.js for routing and middleware
- Utilizes cookies to remember user login information
- MongoDB Atlas stores user, restaurant, and reviews data
- bcrypt hashes user passwords

## Usage
This website is deployed to Netlify. Here is the link to access it: 

## List of what I used
Frontend: 
- JavaScript
- React
- Node.js

Backend:
- Express.js
- MongoDB
- Axios
- JWT
- bcrypt
- Yelp Fusion API

## Environment variables
There is an .env file not included in this repository for storing the MongoDB connection string and my Yelp API Key

## Acknowledgements
This project is inspired by this amazing [tutorial](https://www.youtube.com/watch?v=Q70IMS-Qnjk) by Ania Kubów! 