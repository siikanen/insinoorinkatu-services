const express = require('express');
const router = express.Router();

router.route('/')
    .get( ( req, res ) => {
        res.json(
            {"data":
              [{
                "id": 0,
                "username": "test"
              }]
            })
    })

router.get('/id', ( req, res ) => {
    res.send("MONNI")
})

module.exports = router;
