import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import cors from '@koa/cors';
import { graphqlHTTP } from 'koa-graphql';
import bodyParser from 'koa-bodyparser';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import fs from  'fs';
import util from 'util';
import path from 'path';
import { debugConsole } from './debugConsole';

const readFile = util.promisify(fs.readFile);

const app = new Koa();

const router = new Router();

app.use(bodyParser());
app.on('error', err => {
  // eslint-disable-next-line
  console.log('app error: ', err);
});

app.use(logger());
app.use(cors( { maxAge: 86400, origin: '*' }));

app.use(async (ctx, next) => {
  await next();

  debugConsole(ctx.body);
})

router.get('/', async ctx => {
  ctx.body = 'Welcome to GraphQL Mock server';
});

router.all('/api/graphql', graphqlHTTP(async (request: Request, ctx: Response, koaContext: KoaContext) => {
  const { mocks = {
    DateTime: () => new Date().toISOString(),
  } }= koaContext;

  const typeDefs = await readFile(path.join(__dirname, 'schema.graphql'), 'utf8');

  const schema = addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs }),
    mocks
  });

  return {
    graphiql: true,
    schema,
  }
}));

app.use(router.routes()).use(router.allowedMethods());

export default app;