import gql from 'graphql-tag';

export const CREATE_BOOKING = gql`
    mutation CreateBooking($input: CreateBookingInput!) {
        createBooking(input: $input) {
            id
            name
            startDate
            endDate
            seatsAvailable
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

export const UPDATE_BOOKING = gql`
    mutation UpdateBooking($input: UpdateBookingInput!) {
        updateBooking(input: $input) {
            id
            name
            startDate
            endDate
            seatsAvailable
            productVariant {
                currencyCode
                product {
                    id
                    name
                }
            }
        }
    }
`;

// export const GET_PRODUCT_VARIANTS = gql`
//     query getProductVariants {
//         productVariants(options: {filter: { enabled: {eq:true} } }) {
//             items {
//                 id
//                 price
//                 currencyCode
//                 product {
//                     name
//                 }
//             }
//             totalItems
//         }
//     }
// `;

export const SEARCH_PRODUCTS = gql`
    query SearchProducts {
        search(input: { groupByProduct: false }) {
            totalItems
            items {
                price {
                    __typename
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
                enabled
                productId
                productName
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                        __typename
                    }
                    __typename
                }
                productVariantId
                productVariantName
                productVariantAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                        __typename
                    }
                    __typename
                }
                sku
                channelIds
                __typename
            }
            facetValues {
                count
                facetValue {
                    id
                    createdAt
                    updatedAt
                    name
                    facet {
                        id
                        createdAt
                        updatedAt
                        name
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
    }
`;
