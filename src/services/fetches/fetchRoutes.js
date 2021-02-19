const express = require("express");
const router = express.Router();
const { authorize } = require("../auth/middleware");

const fetch = require("./index");


//595243->recovery eminem
router.get('/album/:id', async(req, res, next) => {
    try{
        console.log('iddd', req.params.id)
        const result = await fetch.fetchAlbum(req.params.id);
        res.send(result);
    } catch(err){
        console.log('some err here', err)
        next(err)
    }
})

module.exports = router;
