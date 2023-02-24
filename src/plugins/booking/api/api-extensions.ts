import gql from 'graphql-tag';

export const commonApiExtensions = gql`
    type Booking implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        startDate: DateTime!
        endDate: DateTime!
        seatsAvailable: Int!
        productVariant: ProductVariant!
    }

    type BookingList implements PaginatedList {
        items: [Booking!]!
        totalItems: Int!
    }
    
    extend type Product {
        bookings: BookingList
    }

    extend type Query {
        bookings(options: BookingListOptions): BookingList!
        booking(id: ID!): Booking
    }

    # Auto-generated at runtime
    input BookingListOptions
`;

export const shopApiExtensions = gql`
    ${commonApiExtensions}
`;

export const adminApiExtensions = gql`
    ${commonApiExtensions}

    extend type Mutation {
        createBooking(input: CreateBookingInput!): Booking!
        updateBooking(input: UpdateBookingInput!): Booking!
    }

    input CreateBookingInput {
        name: String!
        startDate: DateTime
        endDate: DateTime
        seatsAvailable: Int
        productVariantId: ID!
    }

    input UpdateBookingInput {
        id: ID!
        name: String!
        startDate: DateTime
        endDate: DateTime
        seatsAvailable: Int
        productVariantId: ID!
    }
`;
