const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const Restaurant = require('./models/restaurants');
const User = require('./models/user');
const Reviews = require('./models/reviews');
const querystring = require('querystring');

const server = http.createServer(async (req, res) => { // this function could be referred to "middleware" and "request handler"
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const path = req.url;
    const method = req.method;

    if (path.startsWith("/restaurants")){
        if (method === "POST"){
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const parsedBody = querystring.parse(body);
                console.log(parsedBody);
                res.end('{\n"message":\n"it sounds like you would like to create"\n}');
            });
        }
        else if (method === "PUT"){
            res.end('{\n"message":\n"it sounds like you would like to update"\n}');
        }
        else if (method === "DELETE"){
            res.end('{\n"message":\n"it sounds like you would like to delete"\n}');
        }
        else if (method === "GET"){
            const allRestaurants = await Restaurant.getAll();
            const restaurantJSON = JSON.stringify(allRestaurants);
            res.end(restaurantJSON);
        }
    }


    if (path.startsWith("/users")){
        if (method === "POST"){
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const parsedBody = querystring.parse(body);
                console.log('====================');
                console.log(parsedBody);
                console.log('^^^^^^ BODY OF FORM ^^^^^^^^');
                const newUserID = await User.add(parsedBody);
                res.end(`{ "id": ${newUserID}}`);
            });
        }
        else if (method === "PUT"){
            res.end('{\n"message":\n"it sounds like you would like to update"\n}');
        }
        else if (method === "DELETE"){
            console.log(req.url);
            const parts = req.url.split("?q=");
            if (parts[1].startsWith("%7Bid")){
                const id = parseInt(stripSearch(parts[1]));
                console.log(' This is the key to delete:');
                console.log(id);
                console.log('^^^^^^^^^^');
                await User.delete(id);
                res.end(`{\n"message":\n"deleted user_${id}"\n}`);
                }
        }
        else if (method === "GET"){
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
                console.log(id);
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
        }
    

    else if (path.startsWith("/reviews")){
        if (method === "POST"){
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const parsedBody = querystring.parse(body);
                console.log(parsedBody);
                res.end('{\n"message":\n"it sounds like you would like to create"\n}');
            });
        }
        else if (method === "PUT"){
            res.end('{\n"message":\n"it sounds like you would like to update"\n}');
        }
        else if (method === "DELETE"){
            res.end('{\n"message":\n"it sounds like you would like to delete"\n}');
        }
        else if (method === "GET"){
            const allReviews = await Reviews.getAll();
            const reviewsJSON = JSON.stringify(allReviews);
            res.end(reviewsJSON);
        }
    }
    

    else{
        res.end(`{
            "message": 
            Thank your for your patronage. 
            Please send @radishmouse bitcoin and gentle words of encouragement.
        }`);
    }
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