const express = require("express");
const router = express.Router();
const { authorize } = require("../auth/middleware");

const fetch = require("./index");


//595243->recovery eminem
router.get('/album/:id', authorize, async(req, res, next) => {
    try{
        console.log('iddd', req.params.id)
        const result = await fetch.fetchAlbum(req.params.id);
        res.send(result);
    } catch(err){
        console.log('some err here', err)
        next(err)
    }
})

router.get('/artist/:name', authorize,  async(req, res, next) => {
    try{
        console.log('artist', req.params.name)
        const result = await fetch.fetchArtist(req.params.name);
        res.send(result);
    } catch(err){
        console.log('some err here', err)
        next(err)
    }
})

module.exports = router;
