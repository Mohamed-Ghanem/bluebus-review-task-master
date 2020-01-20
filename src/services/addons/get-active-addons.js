import gql from 'graphql-tag';

const GET_ACTIVE_ADDONS = gql`
  query {
    getAddons {
      id
      name_en
      name_ar
      parent_id
      is_active
      created_at
      updated_at
    }
  }
`;

export default GET_ACTIVE_ADDONS;
