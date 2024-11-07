import sequelize from "../config/database";
import supertest from "supertest";
import app from "../app";

import { faker } from "@faker-js/faker";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await sequelize.truncate({ cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

const DEFAULT_PASSWORD = "Default@password2024";

describe("User Controller - Create", () => {
  it("Should create a new valid user and return status 201", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: DEFAULT_PASSWORD,
    };
    const response = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    expect(response.body.id).toBeGreaterThan(0);
  });

  it("Should designate a new id to each created user", async () => {
    const firstUserMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: DEFAULT_PASSWORD,
    };

    const firstUserResponse = await supertest(app)
      .post("/users")
      .send(firstUserMock)
      .expect(201);

    const secondUserMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: DEFAULT_PASSWORD,
    };

    const secondUserResponse = await supertest(app)
      .post("/users")
      .send(secondUserMock)
      .expect(201);

    const firstUserId = firstUserResponse.body.id;
    const secondUserId = secondUserResponse.body.id;

    expect(firstUserId != secondUserId).toBeTruthy();
  });

  it("Should create a new valid user and return a valid JSON structure", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: DEFAULT_PASSWORD,
    };
    const response = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(userMock));
  });

  /**
   *
   * Email validation
   *
   */

  describe("Email Validation", () => {
    it("Should return 400 and error message when trying to create a user with a already used email", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      await supertest(app).post("/users").send(userMock).expect(201);

      const secondUserMock = {
        name: faker.person.fullName(),
        email: userMock.email,
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };

      const response = await supertest(app)
        .post("/users")
        .send(secondUserMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "email", message: "email must be unique" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create a user with undefined email", async () => {
      const userMock = {
        name: faker.person.fullName(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "email", message: "Email is required" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with invalid email", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: "invalid",
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([{ field: "email", message: "Invalid email" }])
      );
    });
  });

  /**
   *
   * Phone number validation
   *
   */

  describe("Phone Validation", () => {
    it("Should return 400 and error message when trying to create user with a already used phone", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      await supertest(app).post("/users").send(userMock).expect(201);

      const secondUserMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: userMock.phone,
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };

      const response = await supertest(app)
        .post("/users")
        .send(secondUserMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "phone", message: "phone must be unique" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with undefined phone", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "phone", message: "Phone number is required" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with invalid phone", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: "83942",
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "phone", message: "Invalid phone number" },
        ])
      );
    });
  });

  /**
   *
   * CPF validation
   *
   */

  describe("CPF Validation", () => {
    it("Should return 400 and error message when trying to create user with a already used CPF", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      await supertest(app).post("/users").send(userMock).expect(201);

      const secondUserMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: userMock.cpf,
        password: DEFAULT_PASSWORD,
      };

      const response = await supertest(app)
        .post("/users")
        .send(secondUserMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "cpf", message: "cpf must be unique" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with undefined cpf", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([{ field: "cpf", message: "CPF is required" }])
      );
    });

    it("Should return 400 and error message when trying to create user with invalid phone", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: "2222",
        password: DEFAULT_PASSWORD,
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([{ field: "cpf", message: "Invalid CPF" }])
      );
    });
  });

  /**
   *
   * Password validation
   *
   */

  describe("Password validation", () => {
    it("Should return 400 and error message when trying to create user with undefined password", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "password", message: "Password is required" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with password that has less then 8 characters ", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Pass@0",
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "password", message: "Invalid password" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with password that has no uppercase characters ", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "password@0",
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "password", message: "Invalid password" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with password that has no lower characters ", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "PASSWORD@0",
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "password", message: "Invalid password" },
        ])
      );
    });

    it("Should return 400 and error message when trying to create user with password that has no special characters ", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Password2024",
      };
      const response = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "password", message: "Invalid password" },
        ])
      );
    });
  });
});
