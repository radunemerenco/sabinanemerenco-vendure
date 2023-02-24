import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BookingListComponent } from './components/booking-list/booking-list.component';
import { BookingDetailComponent } from './components/booking-detail/booking-detail.component';
import { BookingDetailResolver } from './providers/routing/booking-detail-resolver';
import { GetBooking } from './generated-types';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: BookingListComponent,
                data: {
                    breadcrumb: [
                        {
                            label: 'Bookings',
                            link: ['/extensions', 'bookings'],
                        },
                    ],
                },
            },
            {
                path: ':id',
                component: BookingDetailComponent,
                resolve: { entity: BookingDetailResolver },
                data: { breadcrumb: bookingDetailBreadcrumb },
            },
        ]),
    ],
    declarations: [BookingListComponent, BookingDetailComponent],
    providers: [BookingDetailResolver],
})
export class BookingUiLazyModule {}

export function bookingDetailBreadcrumb(resolved: { entity: Observable<GetBooking.Booking> }): any {
    return resolved.entity.pipe(
        map((entity) => [
            {
                label: 'Bookings',
                link: ['/extensions', 'bookings'],
            },
            {
                label: `${entity.id}`,
                link: [],
            },
        ]),
    );
}
