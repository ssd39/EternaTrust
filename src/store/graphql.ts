import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/76928/eternatrust/version/latest",
  cache: new InMemoryCache(),
});

export { client }
