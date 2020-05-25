# GraphQL Mock API

Send `schema` and `mocks` inside POST body to mock any GraphQL schema

```jsx
const schema = `
type Query {
  user: User
}

type User {
  name: String
}
`
const mocks = {
  User: {
    name: 'awesome'
  },
}
```

# How to run
```shell script
yarn start
```