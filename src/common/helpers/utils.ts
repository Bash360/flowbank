import mongoose from 'mongoose';
import NodeEnvPath from './types/env-path';

class Utils {
  static isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static getNodeEnvPath(nodeDev: string): NodeEnvPath {
    const nodeEnvObj = {
      development: {
        basePath: 'src',
        fileExtension: 'ts',
      },
      production: {
        basePath: 'dist/src',
        fileExtension: 'js',
      },
    };
    return nodeEnvObj[nodeDev];
  }
}

export default Utils;
