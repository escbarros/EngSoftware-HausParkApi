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
  it("Should create a parking space", () => {});
});
