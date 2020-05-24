import '@babel/polyfill';
import { config } from './config';
import app from './app';
import { createServer } from 'http';

(async () => {
  const server = createServer(app.callback());

  server.listen(config.GRAPHQL_PORT, () => {
    console.log(`GraphQL server at: ${config.GRAPHQL_PORT}`)
  });
})();