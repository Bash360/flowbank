import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';

import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import container from './container';

const traceExporter = new OTLPTraceExporter();
const config = container.resolve('config');
const logger = container.resolve('logger');
const scrapePort: number = parseInt(config['SCRAPE_PORT']);

const prometheusExporter = new PrometheusExporter({ port: scrapePort }, () => {
  logger.info(`Prometheus scraping end point domain:${scrapePort}/metrics`);
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'Flow Bank',
    [ATTR_SERVICE_VERSION]: '1.0',
  }),

  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
