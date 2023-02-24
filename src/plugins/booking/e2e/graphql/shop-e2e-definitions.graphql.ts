import gql from 'graphql-tag';

export const GET_BOOKINGS = gql`
    query GetBookings {
        bookings {
            items {
                name
                startDate
                endDate
                seatsAvailable
            }
            totalItems
        }
    }
`;

export const GET_BOOKING = gql`
    query GetBooking($id: ID!) {
        booking(id: $id) {
            name
            startDate
            endDate
            seatsAvailable
        }
    }
`;
