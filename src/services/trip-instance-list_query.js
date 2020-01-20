import gql from 'graphql-tag';

export const tripInstanceList = gql`
  query getTrips($trip_template_id: Int!) {
    getTrips(trip_template_id: $trip_template_id) {
      id
      ref_code
      access_level
      date
      time
      status
      is_active
      busSalon {
        id
        name
      }
    }
  }
`;

export default tripInstanceList;
