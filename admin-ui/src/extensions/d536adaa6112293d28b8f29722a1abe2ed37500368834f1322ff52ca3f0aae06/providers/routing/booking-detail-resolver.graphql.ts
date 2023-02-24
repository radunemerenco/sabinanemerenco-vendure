import gql from 'graphql-tag';

export const GET_BOOKING = gql`
    query GetBooking($id: ID!) {
        booking(id: $id) {
            id
            name
            startDate
            endDate
            seatsAvailable
            createdAt
            productVariant {
                id
                name
                price
                currencyCode
                product {
                    id
                    name
                }
            }
        }
    }
`;
