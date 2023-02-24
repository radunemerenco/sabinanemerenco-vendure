// bookings1.entity.ts
import { DeepPartial } from '@vendure/common/lib/shared-types';
import {Product, ProductVariant, VendureEntity} from '@vendure/core';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity()
export class BookingEntity extends VendureEntity {
    constructor(input?: DeepPartial<BookingEntity>) {
        super(input);
    }

    @Column()
    name: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    seatsAvailable: number;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;
}
