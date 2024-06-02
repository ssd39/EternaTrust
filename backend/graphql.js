const { ApolloClient, InMemoryCache } =  require('@apollo/client');

const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/76928/eternatrust/version/latest',
    cache: new InMemoryCache(),
  });

  module.exports = {
    client
  }