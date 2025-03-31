import mongoose from 'mongoose'

class Utils {
  static isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
  }
}

export default Utils
