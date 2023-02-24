import { Inject, Injectable } from '@nestjs/common';
import { ListQueryBuilder, PaginatedList, RequestContext, TransactionalConnection } from '@vendure/core';

import { BookingEntity } from '../entities/bookingEntity';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { PluginInitOptions } from '../types';
import { CreateBookingInput, BookingListOptions, UpdateBookingInput } from '../generated-admin-types';

@Injectable()
export class BookingService {
    constructor(
        private connection: TransactionalConnection,
        @Inject(PLUGIN_INIT_OPTIONS) private options: PluginInitOptions,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: BookingListOptions,
    ): Promise<PaginatedList<BookingEntity>> {
        return this.listQueryBuilder
            .build(BookingEntity, options, { ctx , relations: ['product', "product.variants"]})
            .getManyAndCount()
            .then(([items, totalItems]) => {
                console.log({ items })
                return ({
                    items,
                    totalItems,
                })
            });
    }

    async findOne(ctx: RequestContext, id: string): Promise<BookingEntity | undefined> {
        return this.connection.getRepository(ctx, BookingEntity).findOne(id);
    }

    async create(ctx: RequestContext, input: CreateBookingInput): Promise<BookingEntity> {
        return this.connection.getRepository(ctx, BookingEntity).save(new BookingEntity(input));
    }

    async update(ctx: RequestContext, input: UpdateBookingInput): Promise<BookingEntity> {
        const booking = await this.connection.getEntityOrThrow(ctx, BookingEntity, input.id);
        const updated = { ...booking, ...input };
        return this.connection.getRepository(ctx, BookingEntity).save(updated);
    }
}
