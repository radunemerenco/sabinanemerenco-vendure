import { NgModule } from '@angular/core';
import {SharedModule, addNavMenuSection, addNavMenuItem} from '@vendure/admin-ui/core';

@NgModule({
    imports: [SharedModule],
    providers: [
        addNavMenuItem(
          {
            id: 'bookings',
            label: 'Bookings',
            routerLink: ['/extensions/bookings'],
            icon: 'star',
          },
          'catalog',
        ),
        // addNavMenuSection(
        //     {
        //         id: 'bookings',
        //         label: 'Bookings',
        //         items: [
        //             {
        //                 id: 'bookings',
        //                 label: 'Bookings',
        //                 routerLink: ['/extensions/bookings'],
        //                 icon: 'star',
        //               requiresPermission: 'admin'
        //             },
        //         ],
        //     },
        //     'settings',
        // ),
    ],
    exports: [],
})
export class BookingUiExtensionModule {}
