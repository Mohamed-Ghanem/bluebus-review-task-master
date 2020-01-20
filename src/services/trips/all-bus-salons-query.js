import gql from 'graphql-tag';

export const AllSalons = gql`
  query {
    allBusSalons {
      id
      name
      seat_types {
        id
        name_en
      }
    }
  }
`;
