// bring in the database connection
const db = require('./conn');
const Reviews = require('./reviews');

// need a user object?
// classes should start with an uppercase letter
class User {
    constructor(id, first_name, last_name, email, password){
        // In python it was "self," here it's "this"
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.password = password;
    }
    // static means that the function is something the class can do but an instance cannot
    static getById(id){
        // db.any returns an array of results
        // db.one will give us just the object
        return db.one(`select * from users usr where usr.id=${id}`)
            .then( (userData) => {
                const userInstance = new User(userData.id, userData.first_name, userData.last_name, userData.email, userData.password);
                return userInstance;
            })
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    // no static below since this is an "instance method" and therefore should belong to the individual instances
    save(){
        // db.result returns a report about how many rows got affected
        return db.result(`update users set 
                            first_name='${this.firstName}',
                            last_name='${this.lastName}',
                            email='${this.email}',
                            password='${this.password}'
                        where id=${this.id}
                            `);
    }
    get reviews() {
        return db.any(`select * from reviews where user_id = ${this.id};`)
            .then((arrayOfReviewData) => {
                const arrayOfReviewInstances = [];
                arrayOfReviewData.forEach((data) => {
                    console.log(data);
                    console.log('^^^^ that was DATA ^^^^');
                    console.log(' ');

                    const newInstance = new Reviews (
                                                    data.id, 
                                                    data.score, 
                                                    data.content, 
                                                    data.restaurant_id, 
                                                    data.user_id
                    );
                    arrayOfReviewInstances.push(newInstance);
                    
                    console.log(newInstance);
                    console.log('^^ ^^ ^^ new instance ^^ ^^ ^^');
                    console.log(' ');
                });

                console.log('vvvv that is the array of review instances vvvv');
                console.log(arrayOfReviewInstances);
                console.log(' ');

                return arrayOfReviewInstances;
            });
    }
}

// exploratory code
// User.getById(3)
//     .then((user) => {
//         console.log(user);
//     });

// export user model
module.exports = User;
