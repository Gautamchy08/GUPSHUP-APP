import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePic: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
  return token
}

userSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    throw new Error('Password missing for comparison.')
  }
  return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async password => {
  if (!password) {
    throw new Error('Password missing for hashing.')
  }
  return await bcrypt.hash(password, 10)
}

const User = mongoose.model('User', userSchema)

export default User
