require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.REACT_APP_API_KEY;
const url1 = "https://youtube.googleapis.com/youtube/v3/search";

exports.handler = function (event, context, callback) {
  const searchTerm = event.queryStringParameters.q;

  axios
    .get(url1, {
      params: {
        part: "snippet",
        maxResults: 1,
        key: API_KEY,
        q: searchTerm,
      },
    })
    .then((response) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data),
      });
    })
    .catch((ex) => callback(ex));
};
