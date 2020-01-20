import gql from 'graphql-tag';

export const busSalonList = gql`
  query busSalons($count: Int!, $page: Int!) {
    busSalons(count: $count, page: $page) {
      paginatorInfo {
        total
      }
      data {
        id
        name
        seat_types {
          id
          name_en
        }
      }
    }
  }
`;

export default busSalonList;
