const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const Restaurant = require('./models/restaurants');
const User = require('./models/user');
const Reviews = require('./models/reviews');

const server = http.createServer(async (req, res) => { // this function could be referred to "middleware" and "request handler"
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const method = req.method;


    // if req.url is "/restaurants", send them all restaurants
    // if req.url is "/users", send them all users
    if (method === "POST"){
        res.end('{\nmessage:\n"no soup for you"\n}');
    }
    else if (method === "GET"){
        if (req.url === "/restaurants"){
            const allRestaurants = await Restaurant.getAll();
            const restaurantJSON = JSON.stringify(allRestaurants);
            res.end(restaurantJSON);
        }
        if (req.url.startsWith("/users")){
            const parts = req.url.split("?q=");
            if (parts.length === 1){
                console.log('We think the parts length is 1 after splitting on ?q=');
                const allUsers = await User.getAll();
                const userJSON = JSON.stringify(allUsers);
                res.end(userJSON);
            }
            else if (parts[1].startsWith("{id")){
                const numberOfUsers = await User.countTheUsers;
                const id = parseInt(stripSearch(parts[1]));
                if (id < numberOfUsers){
                    const singleUser = await User.getById(id);
                    const singleUserJSON = JSON.stringify(singleUser);
                    res.end(singleUserJSON);
                }
                else{
                    const allUsers = await User.getAll();
                    const userJSON = JSON.stringify(allUsers);
                    res.end("{\nerror:\n'The user ID you requested does not exist. \nPlease check your number and try again.\nHere are all the users in the meantime.\n}'\n\n"+ userJSON);
                }
            }
            else{
                const allUsers = await User.getAll();
                const userJSON = JSON.stringify(allUsers);
                res.end(userJSON);
            }
        }
        if (req.url === "/reviews"){
            const allReviews = await Reviews.getAll();
            const reviewsJSON = JSON.stringify(allReviews);
            res.end(reviewsJSON);
        }
    }
    // if req.url is "/reviews", send them all reviews
    else{
        res.end(`{
            \nmessage: \nThank your for your patronage. \nPlease send @radishmouse bitcoin and gentle words of encouragement.
        \n}`);
    }
    // else send them a welcome message
});
server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});

function stripSearch(string){
    const splitString = string.split(":");
    const toTheRight = splitString[1];
    const toTheLeft = toTheRight.split("}");
    const id = toTheLeft[0];
    return id;
}