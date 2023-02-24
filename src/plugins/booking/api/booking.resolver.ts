import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, PaginatedList, RequestContext } from '@vendure/core';

import { BookingService } from '../service/booking.service';
import { BookingEntity } from '../entities/bookingEntity';
import { QueryBookingsArgs } from '../generated-admin-types';

@Resolver()
export class BookingResolver {
    constructor(private bookingService: BookingService) {}

    @Query()
    bookings(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryBookingsArgs,
    ): Promise<PaginatedList<BookingEntity>> {
        return this.bookingService.findAll(ctx, args.options || undefined);
    }

    @Query()
    booking(@Ctx() ctx: RequestContext, @Args() args: { id: string }): Promise<BookingEntity | undefined> {
        return this.bookingService.findOne(ctx, args.id);
    }
}
