require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.REACT_APP_API_KEY;

const url2 = "https://youtube.googleapis.com/youtube/v3/channels";

exports.handler = function (event, context, callback) {
  const channelId = event.queryStringParameters.id;

  axios
    .get(url2, {
      params: {
        part: "statistics",
        id: channelId,
        key: API_KEY,
      },
    })
    .then((response) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data),
      });
    })
    .catch((error) => callback(error));
};
