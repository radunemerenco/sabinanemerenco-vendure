/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import path from 'path';

import { BookingPlugin } from '../plugin';

import { CREATE_BOOKING, UPDATE_BOOKING } from './graphql/admin-e2e-definitions.graphql';
import { GET_BOOKINGS, GET_BOOKING } from './graphql/shop-e2e-definitions.graphql';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './config/e2e-initial-data';
import { CreateBooking, UpdateBooking } from './types/generated-admin-types';
import { GetBookings, GetBooking } from './types/generated-shop-types';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));

describe('booking plugin', () => {
    const bookingName = 'bookingName';
    let bookingId: string;

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [BookingPlugin],
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'config/e2e-products.csv'),
            customerCount: 1,
            logging: true,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('admin api', () => {
        it('adds an booking', async () => {
            const initialName = 'initialName';
            const {
                createBooking: { id, name },
            } = await adminClient.query<CreateBooking.Mutation, CreateBooking.Variables>(CREATE_BOOKING, {
                input: {
                    name: initialName,
                },
            });

            bookingId = id;
            expect(name).toEqual(initialName);
        });

        it('updates an booking', async () => {
            const {
                updateBooking: { name },
            } = await adminClient.query<UpdateBooking.Mutation, UpdateBooking.Variables>(UPDATE_BOOKING, {
                input: {
                    id: bookingId,
                    name: bookingName,
                },
            });

            expect(name).toEqual(bookingName);
        });

        it('returns a list of bookings', async () => {
            const {
                bookings: { items, totalItems },
            } = await adminClient.query<GetBookings.Query, GetBookings.Variables>(GET_BOOKINGS);

            expect(totalItems).toEqual(1);
            expect(items[0].name).toEqual(bookingName);
        });

        it('returns a single booking', async () => {
            const { booking } = await adminClient.query<GetBooking.Query, GetBooking.Variables>(GET_BOOKING, {
                id: '1',
            });

            expect(booking?.name).toEqual(bookingName);
        });
    });

    describe('shop api', () => {
        it('returns a list of bookings', async () => {
            const {
                bookings: { items, totalItems },
            } = await shopClient.query<GetBookings.Query, GetBookings.Variables>(GET_BOOKINGS);

            expect(totalItems).toEqual(1);
            expect(items[0].name).toEqual(bookingName);
        });

        it('returns a single booking', async () => {
            const { booking } = await shopClient.query<GetBooking.Query, GetBooking.Variables>(GET_BOOKING, {
                id: '1',
            });

            expect(booking?.name).toEqual(bookingName);
        });
    });
});
