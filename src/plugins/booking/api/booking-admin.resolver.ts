import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    Allow,
    Ctx,
    ListQueryBuilder,
    Permission,
    ProductVariant,
    RequestContext,
    Transaction,
    TransactionalConnection
} from '@vendure/core';

import { BookingService } from '../service/booking.service';
import { BookingEntity } from '../entities/bookingEntity';
import { MutationCreateBookingArgs, MutationUpdateBookingArgs } from '../generated-admin-types';

@Resolver()
export class BookingAdminResolver {
    // constructor(private bookingService: BookingService) {}

    // @Transaction()
    // @Mutation()
    // @Allow(Permission.SuperAdmin)
    // createBooking(@Ctx() ctx: RequestContext, @Args() args: MutationCreateBookingArgs): Promise<BookingEntity> {
    //     return this.bookingService.create(ctx, args.input);
    // }

    constructor(
      private connection: TransactionalConnection,
      private listQueryBuilder: ListQueryBuilder,
      private bookingService: BookingService
    ) {}

    @Transaction()
    @Mutation()
    @Allow(Permission.SuperAdmin)
    async createBooking(
      @Ctx() ctx: RequestContext,
      @Args() { input }: MutationCreateBookingArgs
    ): Promise<BookingEntity> {
        const booking = new BookingEntity(input);
        booking.productVariant = await this.connection.getEntityOrThrow(ctx, ProductVariant, input.productVariantId);
        // if (input.variantId) {
        //     const variant = await this.connection.getEntityOrThrow(ctx, ProductVariant, input.variantId);
        //     booking.productVariant = variant;
        // }
        return this.connection.getRepository(ctx, BookingEntity).save(booking);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.SuperAdmin)
    updateBooking(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateBookingArgs,
    ): Promise<BookingEntity | undefined> {
        return this.bookingService.update(ctx, args.input);
    }
}
