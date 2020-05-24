import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import cors from 'kcors';
import graphqlHttp from 'koa-graphql';
import bodyParser from 'koa-bodyparser';
import { makeExecutableSchema, addMocksToSchema } from 'graphql-tools';

const app = new Koa();

const router = new Router();

app.use(bodyParser());
app.on('error', err => {
  // eslint-disable-next-line
  console.log('app error: ', err);
});

app.use(logger());
app.use(cors());

router.get('/', async ctx => {
  ctx.body = 'Welcome to GraphQL Mock server';
});

app.use(async (ctx, next) => {
  const { schema, mocks = {} } = ctx.request.body;

  if (!schema) {
    ctx.status = 400;
    ctx.body = 'missing schema on body parameter'
    return;
  }

  ctx.typeDefs = schema;
  ctx.mocks = mocks;

  await next();
})

router.all('/graphql', graphqlHttp(async (request: Request, ctx: Response, koaContext: KoaContext) => {
  const { typeDefs, mocks } = koaContext;

  const schema = makeExecutableSchema({ typeDefs });

  addMocksToSchema({ schema, mocks });

  return {
    graphiql: true,
    schema,
    formatError: (error) => {
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    }
  }
}));

app.use(router.routes()).use(router.allowedMethods());

export default app;