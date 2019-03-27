// const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const User = require('../models/user');
const Restaurant = require('../models/restaurants');
const Reviews = require('../models/Reviews');
const Favorites = require('../models/Favorites');

describe('Users model', () => {
    // happy path 👍🏼
    it('should be able to retreive by id', async () => {
        const theUser = await User.getById(3);
        theUser.should.be.an.instanceOf(User);
        // theUser.should.have.length(1);
    });
    // sad path 👎🏼
    it('should error if no user by id', async () => {
        const theUser = await User.getById(324);
        expect(theUser).to.be.null;
        // theUser.should.be.an.instanceOf(User);
        // theUser.should.have.length(1);
    });
    it('should update the user', async () => {
        // grab a user with id 2
        const theUser = await User.getById(2);
        // update the email
        theUser.email = 'tomorrowneverdies@netscape.net';
        // save the user
        await theUser.save();
        const alsoTheUser = await User.getById(2);
        expect(alsoTheUser.email).to.equal('tomorrowneverdies@netscape.net');
    });
    it('should encrypt the password', async () => {
        const password = "bacon"
        // get a user with id 1
        const theUser = await User.getById(1);
        // set their password field to "bacon"
        theUser.setPassword(password);
        // compare their password to "bacon"
        expect(theUser.password).not.to.equal("bacon");
        // it should be false
    });
    it('should be able to check for correct passwords', async () => {
        // get a user with id 1
        const theUser = await User.getById(1);
        // set their password field to "bacon"
        theUser.setPassword("bacon");
        // same them to the database
        await theUser.save();
        // get them back out of the database
        const sameUser = await User.getById(1);
        // ask them if their password is bacon
        const isCorrectPassword = sameUser.checkPassword("bacon");
        expect(isCorrectPassword).to.be.true;
        const isNotCorrectPassword = sameUser.checkPassword("tofu");
        expect(isNotCorrectPassword).to.be.false;
    });
});

describe('Restaurant model', () => {
    it('should be abe to grab an array of restaurants', async () => {
        //write the code you wish existed
        const arrayOfRestaurants = await Restaurant.getAll();
        expect(arrayOfRestaurants).to.be.instanceOf(Array);
    });
    it('should be able to retreive by id', async () => {
        //write the code you wish existed
        const theRestaurant = await Restaurant.getByID(2);
        expect(theRestaurant).to.be.instanceOf(Restaurant);
    });
    it('should update the restaurant', async () => {
        const theRest = await Restaurant.getByID(1);
        theRest.picture = "https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/22_Chilis_9.jpg?itok=cgSeEjJE";
        await theRest.save();
        const alsoTheRest = await Restaurant.getByID(1);
        expect(alsoTheRest.picture).to.equal('https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/22_Chilis_9.jpg?itok=cgSeEjJE');
    });
});

describe('Favorites model', () => {
    it('should be able to grab an array of favorites', async () => {
        const arrayOfFavorites = await Favorites.getAll();
        expect(arrayOfFavorites).to.be.instanceOf(Array);
    });
    it('should be able to retreive by id', async () => {
        //write the code you wish existed
        const theFavorite = await Favorites.getByID(2);
        expect(theFavorite).to.be.instanceOf(Favorites);
    });
    it('should update the favorite', async () => {
        const theFavorite = await Favorites.getByID(1);
        theFavorite.restId = 3;
        await theFavorite.save();
        const alsoTheFavorite = await Favorites.getByID(1);
        expect(alsoTheFavorite.restId).to.equal(3);
    });
    it('should get a count of favorites for a restaurant by id', async () => {
        const theCount = await Restaurant.favoritesById(1);
        expect(parseInt(theCount.count)).to.equal(1);
    });
});

describe('Reviews model', () => {
    it('should be able to grab an array of Reviews', async () => {
        const arrayOfReviews = await Reviews.getAll();
        expect(arrayOfReviews).to.be.instanceOf(Array);
        for (let i = 0; i < arrayOfReviews.length; i++){
            expect(arrayOfReviews[i]).to.be.an.instanceOf(Reviews);
        }
    });
    it('should be able to retreive by id', async () => {
        const theReview = await Reviews.getByID(3);
        expect(theReview).to.be.instanceOf(Reviews);
    });
    it('should update the review', async () => {
        const theReview = await Reviews.getByID(1);
        theReview.score = 3;
        await theReview.save();
        const alsoTheReview = await Reviews.getByID(1);
        expect(alsoTheReview.score).to.equal(3);
    });
    it('should get the average review score for a restaurant by id', async () => {
        const avgReview = await Restaurant.avgReviewById(1);
        expect(parseInt(avgReview.average_score)).to.equal(5);
    });
});

describe('Users and Reviews', () => {
    it('a user instance should be able to retrieve all their reviews', async () => {
        // grab a user by id
        const theUser = await User.getById(3);
        // then get all their reviews
        const theReviews = await theUser.reviews;
        // confirm that their reviews are in an array
        expect(theReviews).to.be.an.instanceOf(Array);
        //and that the array is the correct length
        expect(theReviews).to.be.lengthOf(1);
        // and that each one is an instance of a Review
        
        console.log(' ');
        console.log('     THIS SHOULD BE THE FIRST REVIEW INSTANCE, NOT ARRAY:');
        console.log(theReviews[0]);
        
        expect(theReviews[0]).to.be.an.instanceOf(Reviews);
        
        // for (let i=0; i < theReviews.length; i++){
        //     console.log(' ');
        //     console.log(typeof theReviews[i]);
        //     expect(theReviews[i]).to.be.an.instanceOf(Reviews);
        // }
    });
});