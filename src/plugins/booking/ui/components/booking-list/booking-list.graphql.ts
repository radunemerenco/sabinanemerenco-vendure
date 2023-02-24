import gql from 'graphql-tag';

export const GET_BOOKINGS = gql`
    query GetBookings($options: BookingListOptions) {
        bookings(options: $options) {
            items {
                id
                name
                startDate
                endDate
                seatsAvailable
                createdAt
                product {
                    id
                    name
                    variants {
                        price
                        currencyCode
                    }
                }
            }
            totalItems
        }
    }
`;
