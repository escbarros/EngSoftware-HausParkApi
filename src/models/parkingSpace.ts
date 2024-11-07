import { DataTypes, Model, ForeignKey } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

class ParkingSpace extends Model {
  public id!: number;
  public address!: string;
  public width!: number;
  public height!: number;
  public description!: string;

  public hostId!: ForeignKey<User["id"]>;
  public host?: User;

  public number_of_cars!: number;
  public accepts_parlay!: boolean;
  public has_insurance!: boolean;
  public has_washing_service!: boolean;
  public has_overnight_service!: boolean;
  public has_charging_service!: boolean;
}

ParkingSpace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    number_of_cars: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    accepts_parlay: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    has_insurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    has_washing_service: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    has_overnight_service: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    has_charging_service: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ParkingSpace",
    tableName: "parking_spaces",
  }
);

User.hasMany(ParkingSpace, {
  foreignKey: "hostId",
  as: "parkingSpaces",
});

ParkingSpace.belongsTo(User, {
  foreignKey: "hostId",
  as: "host",
});

export default ParkingSpace;
