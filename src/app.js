require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.post("/api/movies", movieControllers.postMovie);
app.put("/api/movies/:id", movieControllers.updateMovie);
app.delete("/api/movies/:id", movieControllers.deleteMovie);

const userControllers = require("./controllers/userControllers");

app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUsersById);
app.post("/api/users", userControllers.postUsers);
app.put("/api/users/:id", userControllers.updateUsers);
app.delete("/api/users/:id", userControllers.deleteUser);

// const validateMovie = require("./middlewares/validateMovie");

// app.post("/api/movies", validateMovie, movieControllers.postMovie);


module.exports = app;
