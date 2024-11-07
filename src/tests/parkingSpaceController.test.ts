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

describe("Parking Space Controller - Create ", () => {
  it("Should create a new valid parking space and return status 201", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: "Password@2024",
    };
    const parkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const userResponse = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    const userId = userResponse.body.id;

    const response = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(parkingSpaceMock)
      .expect(201);

    expect(response.body.id).toBeGreaterThan(0);
  });
  it("Should designate a new id to each created parking space", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: "Password@2024",
    };
    const firstParkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const secondParkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const userResponse = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    const userId = userResponse.body.id;

    const firstParkingSpaceResponse = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(firstParkingSpaceMock)
      .expect(201);

    const secondParkingSpaceResponse = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(secondParkingSpaceMock)
      .expect(201);

    expect(firstParkingSpaceResponse.body.id).not.toEqual(
      secondParkingSpaceResponse.body.id
    );
  });
  it("Should create a new valid parking space and return a valid JSON structure", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: "Password@2024",
    };
    const parkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const userResponse = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    const userId = userResponse.body.id;

    const response = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(parkingSpaceMock)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining(parkingSpaceMock));
  });

  it("Should return status 404 and error message when trying to create parking space with unknown user", async () => {
    const parkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const response = await supertest(app)
      .post(`/parking-spaces/99999`)
      .send(parkingSpaceMock)
      .expect(404);

    expect(response.body.error).toEqual(
      expect.arrayContaining([
        { field: "", message: "Host/User was not found" },
      ])
    );
  });

  describe("Address validation", () => {
    it("Should return status 400 and error message when trying to create parking space without address", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Password@2024",
      };
      const parkingSpaceMock = {
        width: faker.number.float({ min: 10, max: 20 }),
        height: faker.number.float({ min: 10, max: 20 }),
        length: faker.number.float({ min: 10, max: 20 }),
        description: faker.lorem.sentence(),
        price: faker.number.float({ min: 10, max: 20 }),
      };

      const userResponse = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(201);

      const userId = userResponse.body.id;

      const response = await supertest(app)
        .post(`/parking-spaces/${userId}`)
        .send(parkingSpaceMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "address", message: "Address is required" },
        ])
      );
    });
    it("Should return status 400 and error message when trying to create parking space when address has less then 10 chars", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Password@2024",
      };
      const parkingSpaceMock = {
        address: faker.lorem.word({ length: 6 }),
        width: faker.number.float({ min: 10, max: 20 }),
        height: faker.number.float({ min: 10, max: 20 }),
        length: faker.number.float({ min: 10, max: 20 }),
        description: faker.lorem.sentence(),
        price: faker.number.float({ min: 10, max: 20 }),
      };

      const userResponse = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(201);

      const userId = userResponse.body.id;

      const response = await supertest(app)
        .post(`/parking-spaces/${userId}`)
        .send(parkingSpaceMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          {
            field: "address",
            message: "Address should have at least 10 chars",
          },
        ])
      );
    });
  });

  describe("Dimensions validation", () => {
    describe("Width", () => {
      it("Should return status 400 and error message when trying to create parking space without width", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };
        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          height: faker.number.float({ min: 10, max: 20 }),
          length: faker.number.float({ min: 10, max: 20 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "width", message: "Width is required" },
          ])
        );
      });
      it("Should return status 400 and error message when trying to create parking space when width is less then 1", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };
        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          width: faker.number.float({ max: 0 }),
          height: faker.number.float({ min: 10, max: 20 }),
          length: faker.number.float({ min: 10, max: 20 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "width", message: "Width should be at least 1" },
          ])
        );
      });
    });

    describe("Height", () => {
      it("Should return status 400 and error message when trying to create parking space without height", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };
        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          width: faker.number.float({ min: 10, max: 20 }),
          length: faker.number.float({ min: 10, max: 20 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "height", message: "Height is required" },
          ])
        );
      });

      it("Should return status 400 and error message when trying to create parking space when height is less then 1", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };
        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          width: faker.number.float({ min: 10, max: 20 }),
          height: faker.number.float({ max: 0 }),
          length: faker.number.float({ min: 10, max: 20 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "height", message: "Height should be at least 1" },
          ])
        );
      });
    });

    describe("Length", () => {
      it("Should return status 400 and error message when trying to create parking space without length", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };
        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          width: faker.number.float({ min: 10, max: 20 }),
          height: faker.number.float({ min: 10, max: 20 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "length", message: "Length is required" },
          ])
        );
      });

      it("Should return status 400 and error message when trying to create parking space when length is less then 1", async () => {
        const userMock = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.helpers.fromRegExp(/[0-9]{11}/),
          cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
          password: "Password@2024",
        };

        const parkingSpaceMock = {
          address: faker.location.streetAddress(),
          width: faker.number.float({ min: 10, max: 20 }),
          height: faker.number.float({ min: 10, max: 20 }),
          length: faker.number.float({ max: 0 }),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 20 }),
        };

        const userResponse = await supertest(app)
          .post("/users")
          .send(userMock)
          .expect(201);

        const userId = userResponse.body.id;

        const response = await supertest(app)
          .post(`/parking-spaces/${userId}`)
          .send(parkingSpaceMock)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            { field: "length", message: "Length should be at least 1" },
          ])
        );
      });
    });
  });

  describe("Price validation", () => {
    it("Should return status 400 and error message when trying to create parking space without price", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Password@2024",
      };
      const parkingSpaceMock = {
        address: faker.location.streetAddress(),
        width: faker.number.float({ min: 10, max: 20 }),
        height: faker.number.float({ min: 10, max: 20 }),
        length: faker.number.float({ min: 10, max: 20 }),
        description: faker.lorem.sentence(),
      };

      const userResponse = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(201);

      const userId = userResponse.body.id;

      const response = await supertest(app)
        .post(`/parking-spaces/${userId}`)
        .send(parkingSpaceMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "price", message: "Price is required" },
        ])
      );
    });

    it("Should return status 400 and error message when trying to create parking space with price less than 1", async () => {
      const userMock = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/[0-9]{11}/),
        cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
        password: "Password@2024",
      };
      const parkingSpaceMock = {
        address: faker.location.streetAddress(),
        width: faker.number.float({ min: 10, max: 20 }),
        height: faker.number.float({ min: 10, max: 20 }),
        length: faker.number.float({ min: 10, max: 20 }),
        description: faker.lorem.sentence(),
        price: faker.number.float({ max: 0 }),
      };

      const userResponse = await supertest(app)
        .post("/users")
        .send(userMock)
        .expect(201);

      const userId = userResponse.body.id;

      const response = await supertest(app)
        .post(`/parking-spaces/${userId}`)
        .send(parkingSpaceMock)
        .expect(400);

      expect(response.body.error).toEqual(
        expect.arrayContaining([
          { field: "price", message: "Price should be at least 1" },
        ])
      );
    });
  });

  it("Should return status 400 and error message when trying to create parking space with number of cars less than 1", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: "Password@2024",
    };
    const parkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 20 }),
      number_of_cars: faker.number.float({ max: 0 }),
    };

    const userResponse = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    const userId = userResponse.body.id;

    const response = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(parkingSpaceMock)
      .expect(400);

    expect(response.body.error).toEqual(
      expect.arrayContaining([
        {
          field: "number_of_cars",
          message: "Number of cars must be greater than 0",
        },
      ])
    );
  });

  it("Should return status 400 and error message when trying to create parking space with invalid description", async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.helpers.fromRegExp(/[0-9]{11}/),
      cpf: faker.helpers.fromRegExp(/[0-9]{11}/),
      password: "Password@2024",
    };
    const parkingSpaceMock = {
      address: faker.location.streetAddress(),
      width: faker.number.float({ min: 10, max: 20 }),
      height: faker.number.float({ min: 10, max: 20 }),
      length: faker.number.float({ min: 10, max: 20 }),
      description: 0,
      price: faker.number.float({ min: 10, max: 20 }),
    };

    const userResponse = await supertest(app)
      .post("/users")
      .send(userMock)
      .expect(201);

    const userId = userResponse.body.id;

    const response = await supertest(app)
      .post(`/parking-spaces/${userId}`)
      .send(parkingSpaceMock)
      .expect(400);

    expect(response.body.error).toEqual(
      expect.arrayContaining([
        { field: "description", message: "Description should be a string" },
      ])
    );
  });
});
