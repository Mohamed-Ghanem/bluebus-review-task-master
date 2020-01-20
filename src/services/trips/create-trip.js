import gql from 'graphql-tag';

export const CreatTrip = gql`
  mutation createTripTemplate($input: CreateTripTemplateInput!) {
    createTripTemplate(input: $input) {
      ref_code
      access_level
      from_date
      to_date
      is_active
    }
  }
`;
