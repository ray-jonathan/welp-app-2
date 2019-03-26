const db = require('./conn');

function getUserById(theId){
    return db.any(`select * from users usr where usr.id=${theId};`, [true])
}

// getUserById(1).then(console.log);

function getFavoritesByUserId(theID){
    return db.any(`select first_name ||' '|| last_name as Name, res.name as Favorite_Restaurant from users usr left join favorites fav on fav.user_id = usr.id left join restaurants res on fav.restaurant_id = res.id where usr.id = ${theID};`, [true])
}
// getFavoritesByUserId(4).then(console.log);

function getReviewsByUserId(theID){
    return db.any(`select first_name ||' '|| last_name as Name, res.name as Reviewed_Restaurant, rev.score, rev.content as Review
    from users usr
        left join reviews rev on rev.user_id = usr.id
        left join restaurants res on rev.restaurant_id = res.id
    where usr.id = ${theID};`, [true])
} 
// getReviewsByUserId(3).then(console.log);

function getInfoByResId(theID){
    return db.any(`select *
    from restaurants res
    where res.id = ${theID};`, [true])
} 
// getInfoByResId(3).then(console.log);

function getReviewsByResId(theID){
    return db.any(`select res.name as Restaurant_Name, rev.content as Reviews, usr.first_name ||' '|| usr.last_name as Written_By
    from reviews rev
        inner join restaurants res on rev.restaurant_id = res.id
        inner join users usr on rev.user_id = usr.id
    where res.id = ${theID};`, [true])
} 
// getReviewsByResId(1).then(console.log);

function getAvgRatingByResId(theID){
    return db.any(`select res.name, avg(rev.score) as Average_Score
    from restaurants res
        inner join reviews rev on res.id = rev.restaurant_id
    where res.id = ${theID}
    group by res.name;`, [true])
} 
// getAvgRatingByResId(1).then(console.log);

function getCountOfFavoritesByResId(theID){
    return db.any(`select res.name, count(fav.user_id)
    from restaurants res
        inner join favorites fav on res.id = fav.restaurant_id
    where res.id = ${theID}
    group by res.name;`, [true])
} 
// getCountOfFavoritesByResId(1).then(console.log);

function getCountOfFavoritesAndAvgRatingByRestName(restName){
    return db.any(`select distinct res.name, avg(rev.score) as Average_Score, count(fav.user_id) as Number_Favorited
    from restaurants res
        inner join reviews rev on res.id = rev.restaurant_id
        inner join favorites fav on res.id = fav.restaurant_id
        
    where res.name ilike '${restName}'
    group by res.name, fav.user_id;`, [true])
} 
// getCountOfFavoritesAndAvgRatingByRestName("chilis").then(console.log);

async function main(){
    const user3 = await getCountOfFavoritesAndAvgRatingByRestName("chilis");
    console.log(user3);
}
main();

