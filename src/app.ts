import { loadControllers, scopePerRequest } from 'awilix-express';
import express from 'express';
import 'reflect-metadata';
import errorHandler from './common/middleware/error-handler';
import container from './container';

const app = express();
const utils = container.resolve('utils');
const config = container.resolve('config');
const { basePath, fileExtension } = utils.getNodeEnvPath(config.NODE_ENV);
app.use(express.json());
app.use(scopePerRequest(container));

app.use(
  '/api/v1',
  loadControllers(
    `${basePath}/modules/**/controllers/*.controller.${fileExtension}`
  )
);
app.use(
  '/',
  loadControllers(
    `${basePath}/modules/home/controllers/home.controller.${fileExtension}`
  )
);
app.use(errorHandler);
export default app;
