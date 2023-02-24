import gql from 'graphql-tag';

export const CREATE_BOOKING = gql`
    mutation CreateBooking($input: CreateBookingInput!) {
        createBooking(input: $input) {
            id
            name
            startDate
            endDate
            seatsAvailable
            product {
                id
                name
            }
        }
    }
`;

export const UPDATE_BOOKING = gql`
    mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
            id
            name
            startDate
            endDate
            seatsAvailable
            product {
                id
                name
                variants {
                    price
                }
            }
        }
    }
`;

export const GET_PRODUCTS = gql`
    query getProducts {
        products {
            items {
                id
                name
                variants {
                    price
                }
            }
            totalItems
        }
    }
`;
