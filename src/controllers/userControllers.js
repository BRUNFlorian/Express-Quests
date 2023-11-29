const database = require("../../database");
// afterAll(() => database.end());

/*const getUsers = app.get("/api/users", (req, res) => {
  res.json(users)
})*/
const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).send({id: result.insertId});
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      console.log(users);
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

/*const getUsersById = app.get("/api/users/:id", (req, res) => {
  const wantedId = parseInt(req.params.id);
  
  const user = users.find((user) => user.id === wantedId);
  if (user != null) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});*/

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      console.log("users", users, "id", id);
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUsers,
};
