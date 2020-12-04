import React, { Component } from "react";
import axios from "axios";
import "../stylesheets/appstyles.css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
// import clsx from "clsx";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import dotenv from "dotenv";


dotenv.config();
const url1 = "https://youtube.googleapis.com/youtube/v3/search";
const url2 = "https://youtube.googleapis.com/youtube/v3/channels";

class App extends Component {
  state = {
    searchTerm: "",
    channelId: "",
    channelName: "",
    channelDescription: "",
    country: "",
    channelThumbnail: false,
    errorMessage: "",
    subscriberCount: "",
    viewCount: "",
    videoCount: "",
    displayCard: "none",
    loadingMessage: "block"
  };

  handleOnChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleOnSubmit = (event) => {
    this.setState({displayCard:"none"})
    try {
      if (
        this.state.searchTerm === null ||
        this.state.searchTerm === undefined ||
        this.state.searchTerm === ""
      ) {
        throw new Error("Invalid search term");
      }

      axios
        .get(url1, {
          params: {
            part: "snippet",
            maxResults: 1,
            key: process.env.REACT_APP_API_KEY,
            q: this.state.searchTerm
          }
        })
        .then((response) => {
          this.setState({
            channelId: response.data.items[0].id.channelId,
            channelName: response.data.items[0].snippet.title,
            channelDescription: response.data.items[0].snippet.description,
            channelThumbnail:
              response.data.items[0].snippet.thumbnails.high.url,
            searchTerm: " "
          });

          //get the statiscs data about the channel
          //we have nested this second axios inside the first otherwise the channelId will be undefined
          axios
            .get(url2, {
              params: {
                part: "statistics",
                id: this.state.channelId,
                key: process.env.REACT_APP_API_KEY
              }
            })
            .then((response) => {
              this.setState({
                viewCount: response.data.items[0].statistics.viewCount,
                subscriberCount:
                  response.data.items[0].statistics.subscriberCount,
                videoCount: response.data.items[0].statistics.videoCount,
                displayCard: "block"
              });
            })
            .catch(() => {
              // console.log("Channel information could not found");
              this.setState({ errorMessage: "Channel Not found!" });
              setInterval(() => {
                this.setState({ errorMessage: " " });
              }, 3000);
            });
        })
        .catch(() => {
          this.setState({ errorMessage: "Channel Not found!" });
          setInterval(() => {
            this.setState({ errorMessage: " " });
          }, 3000);
          // console.log("Channel Information not found!!");
        });
    } catch (error) {
      this.setState({ errorMessage: "Channel Not found!" });
      setInterval(() => {
        this.setState({ errorMessage: " " });
      }, 3000);
    }

    event.preventDefault();
  };

  render() {
    return (
      <div className="mainContainer">
        <Typography className="app-header" variant="h4" gutterBottom>
          <i className="fab fa-youtube"></i>
          YouTube Channel Info
        </Typography>
  <Typography  color="initial">Search about you favorite Youtube channels</Typography>      

        <form className="form-control" onSubmit={this.handleOnSubmit} action="">
          <TextField
            onChange={this.handleOnChange}
            autoFocus={true}
            id="standard-basic"
            placeholder="Search any YouTube channel here.."
            label="Search"
            className="text-input-field"
            value={this.state.searchTerm}
          />

          <Box mt={3} ml={15}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="search-btn"
              onClick={this.handleOnSubmit}
            >
              Search..
            </Button>
          </Box>
        </form>

        <Typography variant="h3" color="initial">
          {this.state.errorMessage}
        </Typography>

        <Card
          style={{
            marginTop: "30px",
            minwidth: "450px",
            maxWidth: "500px",
            textAlign: "left",
            backgroundColor: "#d0e8f2",
            display: this.state.displayCard,
            minHeight: "70vh"
          }}
        >
          <CardActionArea>
            {this.state.channelThumbnail ? (
              <CardMedia
                style={{ height: 350 }}
                image={this.state.channelThumbnail}
                title="Youtube Channel Thumbnail"
              />
            ) : (
              <CircularProgress />
            )}

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.state.channelName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {this.state.channelDescription}
              </Typography>
            </CardContent>
          </CardActionArea>

          <Box
            className="statistics-data-header"
            borderRadius={5}
            component="span"
            display="block"
            p={1}
            m={1}
            bgcolor="#79a3b1"
          >
            Total Subscribers :-
            <div className="statistics-data">{this.state.subscriberCount}</div>
          </Box>
          <Box
            className="statistics-data-header"
            borderRadius={5}
            component="span"
            display="block"
            p={1}
            m={1}
            bgcolor="#79a3b1"
          >
            Total Videos uploaded :-
            <div className="statistics-data">{this.state.videoCount || 23}</div>
          </Box>
          <Box
            className="statistics-data-header"
            borderRadius={5}
            component="span"
            display="block"
            p={1}
            m={1}
            bgcolor="#79a3b1"
          >
            Total Views :-
            <div className="statistics-data"> {this.state.viewCount}</div>
          </Box>
        </Card>
      </div>
    );
  }
}

export default App;
