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

-- get all reviews for a restaurant by id
-- get avg review for a restaurant by id
-- get count of favorites for a restaurant by id


-- RESTAURANT SEARCH RESULTS PAGE
-- get all matching rows for a restaurant by name (case insensitive search)
    -- include average review
    -- get count of favorites
-- limit by minimum review
-- pagination