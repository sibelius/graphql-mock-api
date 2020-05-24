import request from 'supertest';
import app from '../app';

it('should return query from schema and mocks', async () => {
  const typeDefs = `
type Query {
  user: User
}

type User {
  name: String
}
`;

  const mocks = {
    Query: () => ({
      user: {
        name: 'awesome',
      },
    }),
    User: () => ({
      name: 'Sibelius',
    }),
  }

  // language=GraphQL
  const query = `
  query Q {
    user {
      name
    }   
  }
`;

  const variables = {
  };

  const payload = {
    query,
    variables,
    schema: typeDefs,
    mocks,
  };

  const response = await request(app.callback())
    .post('/graphql')
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .send(JSON.stringify(payload));

  expect(response.status).toBe(200);
  expect(response.body).toMatchSnapshot();
});