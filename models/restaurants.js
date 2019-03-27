const db = require('./conn');

class Restaurant {
    constructor(id, name, address, street, city, state, phone, menu, picture){
        this.id = id;
        this.name = name;
        this.address = address;
        this.street = street;
        this.city = city;
        this.state = state;
        this.phone = phone; 
        this.menu = menu; 
        this.picture = picture;
    }
    // static means that the function is something the class can do but an instance cannot
    static getAll(){
        // db.any returns an array of results
        // db.one will give us just the object
        return db.any(`select * from restaurants res`)
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    static getByID(id){
        return db.one(`select * from restaurants res where id=${id}`)
            .then( (restData) => {
                const restInstance = new Restaurant(restData.id, restData.name, restData.address, restData.street, restData.city, restData.state, restData.phone, restData.menu, restData.picture);
                return restInstance;
            })
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    // no static below since this is an "instance method" and therefore should belong to the individual instances
    save(){
        // db.result returns a report about how many rows got affected
        return db.result(`update restaurants set 
                            name='${this.name}',
                            address='${this.address}',
                            street='${this.street}',
                            city='${this.city}',
                            state='${this.state}',
                            phone='${this.phone}',
                            menu='${this.menu}',
                            picture='${this.picture}'
                        where id=${this.id}
                            `);
    }
    static favoritesById(id){
            return db.one(`select res.name, count(fav.user_id)
            from restaurants res
                inner join favorites fav on res.id = fav.restaurant_id
            where res.id = ${id}
            group by res.name;`);
    }
    static avgReviewById(id){
            return db.one(`select res.name, avg(rev.score) as Average_Score
            from restaurants res
                inner join reviews rev on res.id = rev.restaurant_id
            where res.id = ${id}
            group by res.name;`);
    }
}

module.exports = Restaurant;
