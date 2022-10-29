const express = require('express');
const path = require('path');

const router = express.Router();

let allRoutes = [];

// HOME PAGE
allRoutes.push('/');
allRoutes.push('/profile');
allRoutes.push('/explore');
allRoutes.push('/library');
allRoutes.push('/community');

// TILESET
allRoutes.push('/tileset/:id');

// MAP
allRoutes.push('/map/:id');

// RESET PASSWORD
allRoutes.push('/reset-password/:id/:token');


// ALL OTHER ROUTES - 404
allRoutes.push('*');


// Set each to use static files in public
allRoutes.forEach((route) => {
    router.use(route, express.static(path.join(__dirname, '../public/build')));
});

module.exports = router;