const express = require('express'); // bring in the express library
const app = express(); // creat a new express app
const es6Renderer = require('express-es6-template-engine');
const port = 3000;

// const http = require('http'); // express replaces this
// const hostname = '127.0.0.1'; // express replaces this


app.engine('html', es6Renderer);
app.set('views', './views');
app.set('view engine', 'html');


app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.render('login-form');
});
app.post('/login', (req, res) => {
    // res.render('');
    console.log(req.body);
    res.send('dumbbutton');
});


const Restaurant = require('./models/restaurants');
const User = require('./models/user');
const Reviews = require('./models/reviews');
const Favorites = require('./models/favorites');
const querystring = require('querystring');

// RESTAURANT ROUTES
app.post('/restaurants', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = querystring.parse(body);
        console.log(parsedBody);
        res.send('{\n"message":\n"it sounds like you would like to create"\n}');
    });
});
app.put('/restaurants', (req, res) => {
    res.send('{\n"message":\n"it sounds like you would like to update"\n}');
});
app.delete('/restaurants', (req, res) => {
    res.send('{\n"message":\n"it sounds like you would like to delete"\n}');
});
app.get('/restaurants', async (req, res) => {
    const allRestaurants = await Restaurant.getAll();
    // const restaurantJSON = JSON.stringify(allRestaurants); // express replaces this
    res.json(restaurantJSON);
});

// USER ROUTES
app.post('/users', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = querystring.parse(body);
        console.log(parsedBody);
        res.send('{\n"message":\n"it sounds like you would like to create"\n}');
    });
});
app.put('/users', (req, res) => {
    res.send('{\n"message":\n"it sounds like you would like to update"\n}');
});
app.delete('/users/:id', async (req, res) => {
    const {id} = req.params;
    await User.delete(id);
    res.send(`{\n"message":\n"deleted user_${id}"\n}`);
});
app.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    const userJSON = await User.getById(id);
    res.json(userJSON);
});
app.get('/users', async (req, res) => {
    const {id} = req.params;
    const allUsers = await User.getAll();
    res.json(allUsers);
});

// REVIEWS ROUTES
app.post('/reviews', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = querystring.parse(body);
        console.log(parsedBody);
        res.send('{\n"message":\n"it sounds like you would like to create"\n}');
    });
});
app.put('/reviews', (req, res) => {
    res.end('{\n"message":\n"it sounds like you would like to update"\n}');
});
app.delete('/reviews', async (req, res) => {
    res.end('{\n"message":\n"it sounds like you would like to delete"\n}');
});
app.get('/reviews/:id', async (req, res) => {
    const {id} = req.params;
    const oneReview = await Reviews.getByID(id);
    res.json(oneReview);
});
app.get('/reviews', async (req, res) => {
    const allReviews = await Reviews.getAll();
    res.json(allReviews);
});

// FAVORITES ROUTES
app.get('/favorites', async (req, res) => {
    const allFavorites = await Favorites.getAll();
    res.json(allFavorites);
});
app.get('/favorites/:id', async (req, res) => {
    const {id} = req.params;
    const oneFavorite = await Favorites.getByID(id);
    res.json(oneFavorite);
});
app.get('/favorites/:id/update/:uid/:rid', async (req, res) => {
    const {id,uid,rid} = req.params;
    const oneFavorite = await Favorites.getByID(id);
    oneFavorite.userId = uid;
    oneFavorite.restId = rid;
    await oneFavorite.save();
    const oneFavoriteAgain = await Favorites.getByID(id);
    res.json(oneFavoriteAgain);
});

// CATCH ALL
app.all('*', (req, res) => {
    res.json(
        {message:
            "Thank your for your patronage. Please send @radishmouse bitcoin and gentle words of encouragement."
        });
});




// server.listen(port, hostname, () => {  // express replaces this
//     console.log(`Server is running at http://${hostname}:${port}`);  // express replaces this
// });  // express replaces this


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// function stripSearch(string){ // unnecessary with how express handles paths with params
//     const splitString = string.split(":");
//     const toTheRight = splitString[1];
//     const toTheLeft = toTheRight.split("}");
//     const id = toTheLeft[0];
//     return id;
// }