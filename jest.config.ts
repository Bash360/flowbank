import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js'],
  globals:{
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  }
};

export default config;
