const db = require('./conn');

class Favorites {
    constructor(id, user_id, restaurant_id){
        this.id = id;
        this.userId = user_id;
        this.restId = restaurant_id;
    }
    // static means that the function is something the class can do but an instance cannot
    static getAll(){
        // db.any returns an array of results
        // db.one will give us just the object
        return db.any(`select * from favorites rev`)
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    static getByID(id){
        return db.one(`select * from favorites fav where id=${id}`)
            .then( (favData) => {
                const favInstance = new Favorites(favData.id, favData.user_id, favData.restaurant_id);
                return favInstance;
            })
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    // no static below since this is an "instance method" and therefore should belong to the individual instances
    save(){
        // db.result returns a report about how many rows got affected
        return db.result(`update favorites set 
                            user_id=${this.userId},
                            restaurant_id=${this.restId}
                        where id=${this.id}
                            `);
    }
}

module.exports = Favorites;
