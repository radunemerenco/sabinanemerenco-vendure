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
            totalItems
        }
    }
`;
