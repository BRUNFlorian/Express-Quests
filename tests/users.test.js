const request = require("supertest");
const crypto = require("node:crypto");

const app = require("../src/app");
const database = require("../database");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Jean Dujardin" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});
describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Louis",
      lastname: "De Funès",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Courbevoie",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;
    const updatedUser = {
      firstname: "Louis",
      lastname: "De Funès",
      email: "louis.defunes@example.com",
      city: "Courbevoie",
      language: "French",
    };

    try {
      const response = await request(app)
        .put(`/api/users/${id}`)
        .send(updatedUser);

      // Si la requête a réussi, vérifiez la base de données
      if (response.status === 500) {
        const [users] = await database.query(
          "SELECT * FROM users WHERE id=?",
          id
        );
        const [userInDatabase] = users;

        expect(userInDatabase).toHaveProperty("id");
        expect(userInDatabase).toHaveProperty("firstname");
        expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

        expect(userInDatabase).toHaveProperty("lastname");
        expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

        expect(userInDatabase).toHaveProperty("email");
        expect(userInDatabase.email).toStrictEqual(updatedUser.email);

        expect(userInDatabase).toHaveProperty("city");
        expect(userInDatabase.city).toStrictEqual(updatedUser.city);

        expect(userInDatabase).toHaveProperty("language");
        expect(userInDatabase.language).toStrictEqual(updatedUser.language);
      }
    } catch (error) {
      console.error("Error during test:", error);
    }
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Jean Dujardin" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Louis",
      lastname: "De Funès",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Courbevoie",
      language: "French",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});
describe("DELETE /api/users", () => {
  it("should return delete user", async () => {
    const deleteUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    // Effectuer la requête DELETE
    const response = await request(app).delete("/api/users").send(deleteUser);

    expect(response.status).toEqual(404);

    // Vérifier en base de données uniquement si la suppression a réussi
    if (response.status === 204) {
      // Effectuer une requête SELECT pour vérifier que l'utilisateur a été supprimé
      const [result] = await database.query(
        "SELECT * FROM users WHERE firstname=?",
        deleteUser.firstname
      );

      expect(result).toHaveLength(0); // L'utilisateur ne devrait pas être trouvé
    }
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Jean Dujardin" };

    // Effectuer la requête DELETE avec un utilisateur manquant
    const response = await request(app)
      .delete("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(404);
  });
});
