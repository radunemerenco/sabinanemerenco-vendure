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
    Coordinate,
    CreateBooking,
    CreateBookingInput,
    Maybe,
    SearchResponse,
    SearchResult,
    SearchResultAsset,
    SinglePrice,
    UpdateBooking,
    UpdateBookingInput,
} from '../../generated-types';
import {CREATE_BOOKING, SEARCH_PRODUCTS, UPDATE_BOOKING} from './booking-detail.graphql';

type SearchInputResult = {
    __typename?: "SearchResult" | undefined;
} & Pick<SearchResult, "sku" | "productVariantId" | "productVariantName"> & {
    productAsset?: Maybe<{
        __typename?: "SearchResultAsset" | undefined;
    } & Pick<SearchResultAsset, "id" | "preview"> & {
        focalPoint?: Maybe<{
            __typename?: "Coordinate" | undefined;
        } & Pick<Coordinate, "x" | "y">> | undefined;
    }> | undefined;
    price: {
        __typename?: "PriceRange" | undefined;
    } | ({
        __typename?: "SinglePrice" | undefined;
    } & Pick<SinglePrice, "value">);
    priceWithTax: {
        __typename?: "PriceRange" | undefined;
    } | ({
        __typename?: "SinglePrice" | undefined;
    } & Pick<SinglePrice, "value">);
}

@Component({
    selector: 'pe-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BookingDetailComponent extends BaseDetailComponent<Booking> implements OnInit {
    detailForm: FormGroup;
    productSearchResult$: Observable<Array<SearchResult>>
    selectedSearchResult: SearchInputResult

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
            productVariantId: ['', Validators.required],
        });
        this.productSearchResult$ = this.dataService
          .query<{ search: SearchResponse }>(SEARCH_PRODUCTS)
          .mapStream(response => response
            .search
            .items
          )


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
            productVariantId: formValue.productVariantId,
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
                productVariantId: formValue.productVariantId,
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
            productVariantId: entity.productVariantId
        });
    }

    stringify(): string {
        return JSON.stringify(this.detailForm.getRawValue(), null, 2)
    }

    selected(product: SearchInputResult): void {
        this.selectedSearchResult = product
        this.detailForm.patchValue({
            productVariantId: product.productVariantId
        }, {
            emitEvent: true
        })
    }
}
