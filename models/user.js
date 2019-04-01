// bring in the database connection
const db = require('./conn');
const Reviews = require('./reviews');
const bcrypt = require('bcryptjs');

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
    static getAll(){
        // db.any returns an array of results
        // db.one will give us just the object
        return db.any(`select * from users usr`)
            .catch(() => {
                return null; // signal an invalid value
            });
    }
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
    static countTheUsers(){
        // counts the number of users in the table
        return db.result(`select max(id) from users;`);
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
    setPassword(newPassword){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        this.password = hash;
    }
    checkPassword(aPassword){
        return bcrypt.compareSync(aPassword, this.password);
    }
    get reviews() {
        return db.any(`select * from reviews where user_id = ${this.id};`)
            .then((arrayOfReviewData) => {
                const arrayOfReviewInstances = [];
                arrayOfReviewData.forEach((data) => {
                    const newInstance = new Reviews(
                                                    data.id, 
                                                    data.score, 
                                                    data.content, 
                                                    data.restaurant_id, 
                                                    data.user_id
                    );
                    arrayOfReviewInstances.push(newInstance);
                });
                return arrayOfReviewInstances;
            });
    }
    

    // for POST methods
    static add(userData){
        // do an insert into the database
        // don't use ${} because you shouldn't be the one interpolating-- use "$_" to let pg-promise do the safe interpolation
        return db.one(`
        insert into users 
            (first_name, last_name, email, password) 
        values 
            ($1, $2, $3, $4) 
        returning id
        `, [userData.first_name, userData.last_name, userData.email, userData.password])
        .then((data) => {
            console.log("new user id is:");
            console.log(data.id);
            return data.id;
        });
        // and return the id of the new user
    }

    // for DELETE methods
    static delete(id){
        return db.result(`delete from users where id=$1`, [id]);
    }
}

// exploratory code
// User.getById(3)
//     .then((user) => {
//         console.log(user);
//     });

// export user model
module.exports = User;
