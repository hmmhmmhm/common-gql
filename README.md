# Common GQL

> 🚧  This is a project that is still under development. Don't use it yet.

> 🦄 Cross Platform GraphQL Atomic component Design Pattern (**version 0.1.0**)

> Have you interested like a *Electron-graphql*? You might be need this design pattern. *Common GQL(Graph Query Language)* is a design pattern that helps clients and servers share the GraphQL schema (named Schema by combining typeDefs and resolvers) using the git submodule in multiple environments (Ex. Electron & Express). This design pattern is based on Apollo graphql + Typescript.



## GQL-Schema

To develop Common-GQL, you first clone this repository, upload it to the github repo (or github private repo), and then mount the default schema for the various projects you want through the git submodule.

### Clone

> Here's how to download the starter kit to develop common-gql-schema right away:

```bash
git clone common-gql
cd common-gql
npm install
```

### Install

> When you run the `git submodule add`, you must work in the folder path that you want to create the corresponding module folder.

```bash
git submodule add <git-url>
git submodule init
git submodule update
npm install ./<path>  --save
```

### Update

> If the business logic has changed since the installation, you can easily update and apply it in any project by executing the command below.

```bash
git submodule update
npm install ./<path>  --save
```

### Test

> An independent test module exists that can test the GraphQL structure being implemented through the Apollo Playground through common-gql-tester [[Link]](https://github.com/hmmhmmhm/common-gql-tester).

```bash
npm install --global common-gql-tester
npm test
```





## GQL-Local

> Common-gql-local is a feature that helps you to run GraphQL queries without running a separate server. It is built into a Starter Pack and can be used directly as Import only without installation.

### Import

> **LocalGQL** enables development as like a client were operating a GQL server. This also able gql-based query processing in client-to-client socket.io communication.

> **LocalGQL** can also be operated on the server. Since LocalGQL work to the call by reference rather than a copy a new resolver function, it can have the same effect as sending an Express query through LocalGQL even after the corresponding Resolver is applied to a server such as Express .

```typescript
import { LocalGQL } from '../<path>'
```

### Query

```javascript
let localGQL = new LocalGQL()

localGQL.query({
  query: gql`
    query {
		# Type Query statements...
    }
  `,
})
```



## GQL-Server

### For express

#### Install

```bash
npm install common-gql-express --save
```

#### Usage

```typescript
import { typeDefs, resolvers } from '../<path>'
import { gqlServer } from 'common-gql-express'


gqlExpress({typeDefs, resolvers}).applyMiddleware({
    path: "/graphql", /* GraphQL Web Path */
    app: expressApp /* Express Instance */
})
```



### Other Platform

>  Lists how common-gql is used by a server framework other than express.

TODO: Plan to develop common-gql for all server frameworks supported by Apollo.



## GQL-Client

Previously, we used ApolloClient to query various query statements through GQL to retrieve data to transform HTML elements, and we used this client to correct code overall according to platform, such as matching it to Electron and Express to eliminate query statements, and putting in calls to call business logic directly.

However, with the `common-gql`, only the `gqlConnector` needs to be pre-written for each environment. Existing GraphQL query statements do not need to be modified as they were written, even if they were Express or Electron.

### Usage

**gqlConnector.ts** (in Electron Embedded  App)

```typescript
import { LocalGQL } from '../<path>'

const gqlConnector = default new LocalGQL()
export gqlConnector
```

**gqlConnector.ts** (in Express Client-Side App)

```typescript
import ApolloClient from 'apollo-boost';

const gqlConnector = new ApolloClient({
  uri: 'https://graphql.example.com'
})
export gqlConnector
```

By referring to these individually created gqlConnector, you can isolate the Express & Electron development process and the Common-GQL development process.



## How it works

> Cleans out the trial and error experienced during the development of the project.

### Client Mocking

To develop the LocalGQL functionality, we used the mocking function of the apolo client. Originally, this function was implemented to test resolver with client only, but by passing resolver to call by reference only, it was fully utilized for local query purposes. However, when using this, resolvers was not normally merged with typeDefs in the following structures described as the default example in the Apollo document.

```javascript
import {ApolloClient} from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from './schema'

const cache = new InMemoryCache()

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  }
})

const client = new ApolloClient({
  link: new SchemaLink({ schema: executableSchema }),
  cache,
})

import gql from 'graphql-tag'
client.query({
  query: gql`
    query TodoApp {
      todos {
        id
        text
        completed
      }
    }
  `,
})
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

Later, by connecting resolver separately to `addMockFunctionToSchema` when executing `makeExecutableSchema` in the above process, found that resolver was connected normally, and this solved the problem.

### Mock Function

Using the 'addMockFunctionToSchema' function above, resolver had to be configured in a different form than the resolver required by the 'apolo-server-core' module. It's about as below.

```javascript
// client addMockFunctionsToSchema{mocks: resolvers}
{
  Query: ()=> ({}),
  Mutation: ()=> ({})
}

// server new ApolloServer({resolvers})
{
  Query: {},
  Mutation: {}
}
```

To solve this problem, we forced common gql to develop the basic structure into an absolute arrow function, and then created and applied a function to convert it to resolverMap, which moves over to apolo-server.



### Solution

The final configuration is as follows:

```typescript
const mockFunctionsToResolverMap = (resolverMap) =>{
  let mockFunctions = {}
  for (var key in resolverMap) {
      if (!resolverMap.hasOwnProperty(key)) continue
      mockFunctions[key] = resolverMap[key]()
  }
  return mockFunctions
}

const executableSchema = makeExecutableSchema({typeDefs})

addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: resolvers
})

let client = new ApolloClient({
  link: new SchemaLink({ schema: executableSchema }),
  cache,
})
```



## TODO Plan

- [ ] More atomic resolvers

- [ ] More atomic typeDefs

- [ ] npx based stater-kit

- [ ] graphql resolver typescript interface inspection

  - Youtube [[Link]](https://www.youtube.com/watch?v=6ZSF60zVFow)

  - ```
    // package.json
        "@graphql-codegen/cli": "^1.2.0",
        "@graphql-codegen/near-operation-file-preset": "^1.2.0",
        "@graphql-codegen/schema-ast": "^1.2.0",
        "@graphql-codegen/typescript-operations": "^1.2.0",
        "@graphql-codegen/typescript-resolvers": "^1.2.0",
        "graphqlgen": "^0.6.0-rc9",
    
    // codegen.yml
    schema: 'graphql/**/*.gql'
    documents: 'graphql/**/*.gql'
    generates:
      src/models.ts:
        plugins:
          - typescript
        config:
          avoidOptionals: true
      dist/model.graphql:
        plugins:
          - schema-ast
    ```



## License

MIT Licensed.