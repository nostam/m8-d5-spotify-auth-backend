const { Schema, model } = require("mongoose")

const UserSchema = new Schema(
    {
      name: String,
      surname: String,
      password: String,
      email: String,
      refreshTokens: [{ token: { type: String } }]
    },
    { timestamps: true }
  )

  module.exports = model("user", UserSchema)