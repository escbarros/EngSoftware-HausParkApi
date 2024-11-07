import { DataTypes, Model, HasManyGetAssociationsMixin } from "sequelize";
import sequelize from "../config/database";
import ParkingSpace from "./parkingSpace";
class User extends Model {
  public id!: number;
  public name!: string;
  public cpf!: string;
  public phone!: string;
  public email!: string;
  public password!: string;

  public getParkingSpaces!: HasManyGetAssociationsMixin<ParkingSpace>;
  public parkingSpaces?: ParkingSpace[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
