import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import {
  ApolloLink,
  // , Observable
} from 'apollo-link';

const cache = new InMemoryCache();

// const request = async operation => {
//   const token = JSON.parse(localStorage.getItem('token'));
//   const headers = token
//     ? {
//         authorization: `Bearer ${token}`,
//       }
//     : {};
//   operation.setContext({
//     headers,
//   });
// };

// const requestLink = new ApolloLink(
//   (operation, forward) =>
//     new Observable(observer => {
//       let handle;
//       Promise.resolve(operation)
//         .then(oper => request(oper))
//         .then(() => {
//           handle = forward(operation).subscribe({
//             next: observer.next.bind(observer),
//             error: observer.error.bind(observer),
//             complete: observer.complete.bind(observer),
//           });
//         })
//         .catch(observer.error.bind(observer));

//       return () => {
//         if (handle) handle.unsubscribe();
//       };
//     })
// );

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) console.log(graphQLErrors);
      // graphQLErrors.map(({ message, locations, path }) =>
      //   console.log(
      //     `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      //   )
      // );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    // requestLink,
    new HttpLink({
      uri: process.env.REACT_APP_BACKEND_URL,
    }),
  ]),
  cache,
  connectToDevTools: true,
});

export default client;
