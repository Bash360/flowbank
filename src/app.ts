import 'reflect-metadata';
import express from 'express';
import { scopePerRequest } from 'awilix-express';
import container from './container';

const app = express();

app.use(scopePerRequest(container));

export default app;
