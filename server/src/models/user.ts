import {
  type Sequelize,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  DataTypes,
} from "sequelize";
import bcrypt from "bcrypt";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare isAdmin?: boolean;
  declare password: string;

  // hash the password on creation
  async setPassword(password: string): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  // set the email to lowercase
  async setEmail() {
    this.email = this.email.toLowerCase();
  }
}

export function userFactory(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cant be null",
          },
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },

    {
      hooks: {
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
          await user.setEmail();
        },
        beforeUpdate: async (updatedUser: User) => {
          if (updatedUser.changed("password")) {
            await updatedUser.setPassword(updatedUser.password);
          } else {
            console.log("password didnt change, no need to hash");
          }
        },
      },

      sequelize,
      timestamps: true,
      updatedAt: false,
      tableName: "users",
    }
  );
  return User;
}
