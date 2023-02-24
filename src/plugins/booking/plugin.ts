import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { BookingEntity } from './entities/bookingEntity';
import { BookingService } from './service/booking.service';
import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';
import { BookingResolver } from './api/booking.resolver';
import { BookingAdminResolver } from './api/booking-admin.resolver';
import { PluginInitOptions } from './types';

/**
 * Booking Vendure plugin.
 *
 * @example
 * ```TypeScript
 * export const config: VendureConfig = {
 *   //...
 *   plugins: [
 *     BookingPlugin.init({
 *       // options
 *     }),
 *   ]
 * }
 * ```
 */
@VendurePlugin({
    // Importing the PluginCommonModule gives all of our plugin's injectables (services, resolvers)
    // access to the Vendure core providers. See https://www.vendure.io/docs/typescript-api/plugin/plugin-common-module/
    imports: [PluginCommonModule],
    entities: [BookingEntity],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [BookingResolver, BookingAdminResolver],
    },
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [BookingResolver],
    },
    providers: [
        BookingService,
        // By definiting the `PLUGIN_INIT_OPTIONS` symbol as a provider, we can then inject the
        // user-defined options into other classes, such as the {@link BookingService}.
        { provide: PLUGIN_INIT_OPTIONS, useFactory: () => BookingPlugin.options },
    ],
})
export class BookingPlugin {
    static options: PluginInitOptions;

    /**
     * The static `init()` method is a convention used by Vendure plugins which allows options
     * to be configured by the user.
     */
    static init(options: PluginInitOptions): Type<BookingPlugin> {
        this.options = options;
        return BookingPlugin;
    }

    static uiExtensions: AdminUiExtension = {
        extensionPath: path.join(__dirname, 'ui'),
        ngModules: [
            {
                type: 'shared' as const,
                ngModuleFileName: 'booking-ui-extension.module.ts',
                ngModuleName: 'BookingUiExtensionModule',
            },
            {
                type: 'lazy' as const,
                route: 'bookings',
                ngModuleFileName: 'booking-ui-lazy.module.ts',
                ngModuleName: 'BookingUiLazyModule',
            },
        ],
    };
}
