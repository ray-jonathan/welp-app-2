const db = require('./conn');
const Restaurant = require('./restaurants');

class Reviews {
    constructor(id, score, content, restaurant_id, user_id){
        this.id = id;
        this.score = score;
        this.content = content;
        this.restId = restaurant_id;
        this.userId = user_id;
    }
    // static means that the function is something the class can do but an instance cannot
    static getAll(){
        // db.any returns an array of results
        // db.one will give us just the object
        return db.any(`select * from reviews rev`)
            .then( (arrayOfReviews) => {
                return arrayOfReviews.map((revData) => {
                    return new Reviews(
                        revData.id, revData.score, revData.content, revData.restaurant_id, revData.user_id);
                    });
            })
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    static getByID(id){
        return db.one(`select * from reviews rev where id=${id}`)
            .then( (revData) => {
                const revInstance = new Reviews(revData.id, revData.score, revData.content, revData.restaurant_id, revData.user_id);
                return revInstance;
                // or
                // return new Reviews(revData.id, revData.score, revData.content, revData.restaurant_id, revData.user_id);
            })
            .catch(() => {
                return null; // signal an invalid value
            });
    }
    // no static below since this is an "instance method" and therefore should belong to the individual instances
    save(){
        // db.result returns a report about how many rows got affected
        return db.result(`update reviews set 
                            score=${this.score},
                            content='${this.content}',
                            restaurant_id=${this.restId},
                            user_id=${this.userId}
                        where id=${this.id}
                            `);
    }
}

module.exports = Reviews;
