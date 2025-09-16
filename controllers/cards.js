const express = require('express');
const router = express.Router();

const User = require('../models/user.js');



// GET route to show all of a user's cards:
router.get('/', async (req, res) => {
    try {
        // look up the user from req.session
        const currentUser = await User.findById(req.session.user._id);
        // render index.ejs passing in all of the current user's cards
        res.render('cards/index.ejs', {
            cards: currentUser.cards,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// GET route to show form for adding a new card:
router.get('/new', async (req, res) => {
    res.render('cards/new.ejs');
});

// POST route to add a new card to user's collection when submitted:
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        // push req.body (new form data obj) to the user's cards array
        currentUser.cards.push(req.body);
        // save changes to the user
        await currentUser.save();
        // redirect back to the cards index page
        res.redirect(`/users/${currentUser._id}/cards`);
    } catch (error) {
        // if any errors log them and redirect back home
        console.log(error);
        res.redirect('/');
    }
});

// GET route to show details for a specific card:
router.get('/:cardId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        // find the specific card by the cardId supplied from req.params
        const card = currentUser.cards.id(req.params.cardId);
        // render show.ejs view passing card data in the context object
        res.render('cards/show.ejs', {
            card: card,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// GET route to show form to edit a specific card's information:
router.get('/:cardId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const card = currentUser.cards.id(req.params.cardId);
        res.render('cards/edit.ejs', {
            card: card,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
// DELETE route to delete a specific card from user's collection:
router.delete('/:cardId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.cards.id(req.params.cardId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/cards`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});







module.exports = router;