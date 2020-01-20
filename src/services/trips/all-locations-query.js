import gql from 'graphql-tag';

export const AllLocations = gql`
  query {
    activeLocations {
      id
      name_en
      type
      is_active
      city {
        id
        name_en
        is_active
      }
    }
  }
`;
