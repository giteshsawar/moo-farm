const mongoose = require("mongoose");
const UserSchema = mongoose.model("user");
const HttpStatus = require("http-status-codes");

const createNewUser = async (user) => {
  try {
    const { email, password, name, username } = user;
    const isValid =
      email.length && password.length && name.length && username.length;
    if (!isValid)
      return {
        result: { user: null, error: "Not a valid user object" },
        status: HttpStatus.EXPECTATION_FAILED,
      };

    const userInDB = await UserSchema.findOne({ email: user.email });
    console.log('user is in db', userInDB);
    if (userInDB)
      return {
        result: { user: null, error: "User already exist" },
        status: HttpStatus.NOT_ACCEPTABLE,
      };

    const newUser = await new UserSchema(user).save();
    if (!newUser)
      return {
        result: { user: null, error: "Error saving user in DB" },
        status: HttpStatus.METHOD_FAILURE,
      };

    delete newUser.password;
    return { result: { user: newUser, error: null }, status: HttpStatus.OK };
  } catch (err) {
    console.log("error saving user", err);
    return {
      result: { user: null, error: "Error saving user in DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const loginUser = async (creds) => {
  try {
    const { username, password } = creds;
    const isValid = username.length && password.length;
    if (!isValid)
      return {
        result: {
          user: null,
          error: "Provide both username and password to login",
        },
        status: HttpStatus.EXPECTATION_FAILED,
      };

    const user = await UserSchema.findOne({ username, password });
    if (!user)
      return {
        result: { user: null, error: "Username or password is incorrect" },
        status: HttpStatus.UNAUTHORIZED,
      };

    delete user.password;
    return { result: { user, error: null }, status: HttpStatus.OK };
  } catch (err) {
    console.log("error logging user", err);
    return {
      result: { user: null, error: "Error in authenticating user from DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createNewUser,
  loginUser,
};
