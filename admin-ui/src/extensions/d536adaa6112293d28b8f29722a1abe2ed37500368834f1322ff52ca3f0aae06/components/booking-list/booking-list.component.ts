import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { BaseListComponent, DataService } from '@vendure/admin-ui/core';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { GET_BOOKINGS } from './booking-list.graphql';
import { GetBookings, SortOrder } from '../../generated-types';

@Component({
    selector: 'pe-booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingListComponent
    extends BaseListComponent<GetBookings.Query, GetBookings.Items, GetBookings.Variables>
    implements OnInit {
    filterTermControl = new FormControl('');

    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => {
                const result$ =  this.dataService.query<GetBookings.Query>(GET_BOOKINGS, args);

                result$.mapSingle((obs => {
                    console.log({obs})
                }))//.subscribe((r => console.log(r)))
                return result$
            },
            (data) => data.bookings,
            (skip, take) => {
                return {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    options: {
                        skip,
                        take,
                        sort: {
                            createdAt: SortOrder.Desc,
                        },
                        ...(this.filterTermControl.value
                            ? {
                                  filter: {
                                      name: {
                                          contains: this.filterTermControl.value,
                                      },
                                  },
                              }
                            : {}),
                    },
                };
            },
        );
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.filterTermControl.valueChanges
            .pipe(debounceTime(250), takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
    }
}
