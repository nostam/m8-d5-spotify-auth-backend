const express = require("express");
const axios = require("axios");

const fetchAlbum = async (id) => {
  // await axios.get('https://deezerdevs-deezer.p.rapidapi.com/album/'+id , {headers: {
  //     'x-rapidapi-key': 'a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487',
  //     "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  //   }})
  // .then((response) => {
  //   console.log(response.data);
  //   return response.data;
  // })
  try {
    const { data } = await axios.get(
      "https://deezerdevs-deezer.p.rapidapi.com/album/" + id,
      {
        headers: {
          "x-rapidapi-key":
            "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
  // console.log('id', id)
  // try{
  // const fetch = await fetch(
  //     "https://deezerdevs-deezer.p.rapidapi.com/album/" + id,
  //     {
  //       method: "GET",
  //       headers: {
  //         "x-rapidapi-key":
  //           "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
  //         "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  //       },
  //     },
  //   )
  //   if(fetch.ok){
  //     fetch.json()
  //     return fetch;
  //   } else {
  //       console.log('........');
  //   }
  //   return fetch;
  // } catch(err){
  //     console.log(err)
  //     return err;
  // }
};

const fetchArtist = async (artist) => {
  //https://deezerdevs-deezer.p.rapidapi.com/search?q=${artist}
    try {
        const { data } = await axios.get(
          "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
          {
            headers: {
              "x-rapidapi-key":
                "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
              "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            },
          }
        );
        return data;
      } catch (error) {
        throw new Error(error);
      }
};

module.exports = {
  fetchAlbum,
  fetchArtist,
};
