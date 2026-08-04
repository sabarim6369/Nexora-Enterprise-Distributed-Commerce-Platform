import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]:
      process.env.OTEL_SERVICE_NAME || 'product-service',
  }),

  traceExporter: new ZipkinExporter({
    url: process.env.ZIPKIN_URL,
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});


sdk.start();

console.log('OpenTelemetry started');

process.on('SIGTERM', async () => {
  await sdk.shutdown();
});