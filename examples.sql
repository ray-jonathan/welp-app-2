-- USER PROFILE
-- get all info for a user by id
    -- get only a few fields for public version
select first_name ||' '|| last_name as Name, email
from users usr
where usr.id = 1;
    -- get all fields for private version
select *
from users usr
where usr.id = 1;
-- get all favorites for a user by id
select first_name ||' '|| last_name as Name, res.name as Favorite_Restaurant
from users usr
	left join favorites fav on fav.user_id = usr.id
	left join restaurants res on fav.restaurant_id = res.id
where usr.id = 1;
-- get all reviews written by a user by id
select first_name ||' '|| last_name as Name, res.name as Reviewed_Restaurant, rev.score, rev.content as Review
from users usr
	left join reviews rev on rev.user_id = usr.id
	left join restaurants res on rev.restaurant_id = res.id
where usr.id = 1;

-- RESTAURANT PROFILE
-- get all info for a restaurant by id
select *
from restaurants res
where res.id = 1;
-- get all reviews for a restaurant by id
select res.name as Restaurant_Name, rev.content as Reviews, usr.first_name ||' '|| usr.last_name as Written_By
from reviews rev
	inner join restaurants res on rev.restaurant_id = res.id
	inner join users usr on rev.user_id = usr.id
where res.id = 1;
-- get avg review for a restaurant by id
select res.name, avg(rev.score) as Average_Score
from restaurants res
	inner join reviews rev on res.id = rev.restaurant_id
where res.id = 1
group by res.name;
-- get count of favorites for a restaurant by id
select res.name, count(fav.user_id)
from restaurants res
	inner join favorites fav on res.id = fav.restaurant_id
where res.id = 1
group by res.name;


-- RESTAURANT SEARCH RESULTS PAGE
-- get all matching rows for a restaurant by name (case insensitive search)
    -- include average review
    -- get count of favorites
select distinct res.name, avg(rev.score) as Average_Score, count(fav.user_id) as Number_Favorited
from restaurants res
	inner join reviews rev on res.id = rev.restaurant_id
	inner join favorites fav on res.id = fav.restaurant_id
	
where res.name ilike 'chilis'
group by res.name, fav.user_id;
-- limit by minimum review
select res.name, avg(rev.score) as Average_Score, count(fav.user_id) as Number_Favorited
from restaurants res
	inner join reviews rev on res.id = rev.restaurant_id
	inner join favorites fav on res.id = fav.restaurant_id
	
where rev.score > 3
group by res.name;
-- pagination