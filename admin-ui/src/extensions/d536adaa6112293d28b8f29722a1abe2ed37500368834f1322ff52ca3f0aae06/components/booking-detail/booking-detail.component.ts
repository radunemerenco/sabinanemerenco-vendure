import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BaseDetailComponent,
    DataService,
    NotificationService,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Observable, of } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import {
    Booking,
    CreateBooking,
    CreateBookingInput,
    Product,
    ProductList,
    UpdateBooking,
    UpdateBookingInput,
} from '../../generated-types';
import {CREATE_BOOKING, GET_PRODUCTS, UPDATE_BOOKING} from './booking-detail.graphql';

@Component({
    selector: 'pe-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BookingDetailComponent extends BaseDetailComponent<Booking> implements OnInit {
    detailForm: FormGroup;
    products$: Observable<Array<Product>>

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private formBuilder: FormBuilder,
        protected dataService: DataService,
        private changeDetector: ChangeDetectorRef,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            seatsAvailable: ['', Validators.required],
            productId: ['', Validators.required],
        });
        this.products$ = this.dataService
          .query<{ products: ProductList }>(GET_PRODUCTS)
          .mapStream(response => response.products.items)


    }

    ngOnInit(): void {
        this.init();
    }

    create(): void {
        if (!this.detailForm) {
            return;
        }
        const formValue = this.detailForm.value;
        const booking: CreateBookingInput = {
            name: formValue.name,
            startDate: new Date(formValue.startDate).toISOString(),
            endDate: new Date(formValue.endDate).toISOString(),
            seatsAvailable: formValue.seatsAvailable,
            productId: formValue.productId,
        };
        this.dataService
            .mutate<CreateBooking.Mutation, CreateBooking.Variables>(CREATE_BOOKING, { input: booking })
            .subscribe(
                (data) => {
                    this.notificationService.success('common.notify-create-success', {
                        entity: 'Booking',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createBooking.id], { relativeTo: this.route });
                },
                () => {
                    this.notificationService.error('common.notify-create-error', {
                        entity: 'Booking',
                    });
                },
            );
    }

    save(): void {
        this.saveChanges()
            .pipe(filter((result) => !!result))
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success('common.notify-update-success', {
                        entity: 'Booking',
                    });
                },
                () => {
                    this.notificationService.error('common.notify-update-error', {
                        entity: 'Booking',
                    });
                },
            );
    }

    private saveChanges(): Observable<boolean> {
        if (this.detailForm.dirty) {
            const formValue = this.detailForm.value;
            const input: UpdateBookingInput = {
                id: this.id,
                name: formValue.name,
                startDate: new Date(formValue.startDate),
                endDate: new Date(formValue.endDate),
                seatsAvailable: formValue.seatsAvailable,
                productId: formValue.productId,
            };
            return this.dataService
                .mutate<UpdateBooking.Mutation, UpdateBooking.Variables>(UPDATE_BOOKING, {
                    input,
                })
                .pipe(mapTo(true));
        } else {
            return of(false);
        }
    }

    protected setFormValues(entity: Booking): void {
        console.log({entity})
        this.detailForm.patchValue({
            name: entity.name,
            startDate: entity.startDate,
            endDate: entity.endDate,
            seatsAvailable: entity.seatsAvailable,
            // @ts-ignore
            productId: entity.productId
        });
    }

    stringify(): string {
        return JSON.stringify(this.detailForm.getRawValue(), null, 2)
    }
}
