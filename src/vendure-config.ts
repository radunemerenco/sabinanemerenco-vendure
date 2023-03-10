import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig, DefaultAssetNamingStrategy,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import {AssetServerPlugin, configureS3AssetStorage} from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';
import { BookingPlugin } from './plugins/booking/plugin';
import {ReviewsPlugin} from "./plugins/reviews/reviews-plugin";
import {customAdminUi} from "./compile-admin-ui";
import {BookingEntity} from "./plugins/booking/entities/bookingEntity";

const IS_DEV = process.env.APP_ENV === 'dev';
const IS_PROD = path.basename(__dirname) === 'dist';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiPlayground: {
                settings: { 'request.credentials': 'include' } as any,
            },
            adminApiDebug: true,
            shopApiPlayground: {
                settings: { 'request.credentials': 'include' } as any,
            },
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {
        OrderLine: [
            {
                name: 'booking',
                type: 'relation',
                entity: BookingEntity,
                graphQLType: 'Booking',
                // TODO: add a validation to restrict buying a booking with startDate from the past
                // validate: value => {}
            }
        ]
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            // port: 5002,
            namingStrategy: new DefaultAssetNamingStrategy(),
            storageStrategyFactory: configureS3AssetStorage({
                bucket: process.env.MINIO_BUCKET_NAME ?? 'my-minio-bucket',
                credentials: {
                    accessKeyId: process.env.MINIO_ACCESS_KEY_ID ?? '',
                    secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY ?? '',
                },
                nativeS3Configuration: {
                    endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                },
            }),
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation.
                // Here we are assuming a storefront running at http://localhost:8080.
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
            app: customAdminUi({ recompile: !IS_PROD, devMode: !IS_PROD }),
        }),
        BookingPlugin.init({}),
        ReviewsPlugin
    ],
};
