const { Schema, model } = require("mongoose")
const bcrypt = require("bcryptjs")

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

  UserSchema.pre("save", async function (next) {
    const user = this
    const plainPW = user.password
  
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(plainPW, 10)
    }
    next()
  })

  module.exports = model("user", UserSchema)