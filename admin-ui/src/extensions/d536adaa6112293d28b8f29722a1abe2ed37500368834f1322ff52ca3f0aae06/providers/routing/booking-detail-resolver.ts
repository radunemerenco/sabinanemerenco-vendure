import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, BaseEntityResolver } from '@vendure/admin-ui/core';

import { GetBooking } from '../../generated-types';

import { GET_BOOKING } from './booking-detail-resolver.graphql';

@Injectable()
export class BookingDetailResolver extends BaseEntityResolver<GetBooking.Booking> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                id: '',
                createdAt: new Date(),
                name: '',
                seatsAvailable: 0,
                endDate: '',
                startDate: ''
            },
            (id) =>
                dataService
                    .query<GetBooking.Query, GetBooking.Variables>(GET_BOOKING, { id })
                    .mapStream((data) => data.booking),
        );
    }
}
