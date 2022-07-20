using ferrero.mro as my from '../db/data-model';

// @requires : 'authenticated-user'
// @requires : 'mrobeUser_sc'
// @(restrict : [
//     {
//         grant : 'READ',
//         to    : 'mrobeReadOnly_sc'
//     },
//     {
//         grant : ['*'],
//         to    : 'mrobeUser_sc'
//     }
// ])
service MroService @(impl : './cat-service.js') @(path : '/MroSrv') {
    // @readonly
    entity Roles @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.Roles;

    entity Users @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.Users_Role_Assign;

    entity MaintainApproval @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.User_Approve_Maintain;

    entity VendorList
                                  // @(restrict : [
                                  //     {
                                  //         grant : 'READ',
                                  //         to    : 'mrobeReadOnly_sc'
                                  //     },
                                  //     {
                                  //         grant : ['*'],
                                  //         to    : 'mrobeUser_sc'
                                  //     }
                                  // ])
                                  as projection on my.Vendor_List;

    entity PricingConditions
                                  // @(restrict : [
                                  //     {
                                  //         grant : 'READ',
                                  //         to    : 'mrobeReadOnly_sc'
                                  //     },
                                  //     {
                                  //         grant : ['*'],
                                  //         to    : 'mrobeUser_sc'
                                  //     }
                                  // ])
                                  as projection on my.Pricing_Conditions;

    entity StatusCodeList @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.statusList;

    entity CountriesCodeList @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.countriesCodeList;
    // entity VendorComments    as projection on my.vendorComments

    entity VendorComments @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.Vendor_Comments;

    entity PricingComments
                                  // @(restrict : [
                                  //     {
                                  //         grant : 'READ',
                                  //         to    : 'mrobeReadOnly_sc'
                                  //     },
                                  //     {
                                  //         grant : ['*'],
                                  //         to    : 'mrobeUser_sc'
                                  //     }
                                  // ])
                                  as projection on my.Pricing_Comments;

    entity PricingNotifications @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                            as projection on my.Pricing_Notifications;

    entity VendorNotifications
                                  //  @(restrict : [
                                  //     {
                                  //         grant : 'READ',
                                  //         to    : 'mrobeReadOnly_sc'
                                  //     },
                                  //     {
                                  //         grant : ['*'],
                                  //         to    : 'mrobeUser_sc'
                                  //     }
                                  // ])
                                  as projection on my.Vendor_Notifications;

    @(restrict : [{
        grant : ['*'],
        to    : 'mrobeUser_sc'
    }])
    action approvePricing(uuid : String, manufacturerCode : String, countryCode : String) returns String;

    @readonly
    entity CheckUserRole          as projection on my.Users_Role_Assign;

    @readonly
    entity UserDetails            as projection on my.UserDetails;

    @cds.redirection.target
    entity VendorNotifications_A  as projection on my.VendorNotifications_A;

    entity VendorNotifications_U  as projection on my.VendorNotifications_U;

    @readonly  @cds.redirection.target
    entity PricingNotifications_U as
        select * from my.Pricing_Notifications
        where
               createdBy   =  upper($user)
            or status.code in ('Forwarded')
        order by
            modifiedAt desc;

    @readonly
    entity PricingNotifications_A as
        select * from my.Pricing_Notifications
        where
            approver = upper($user)
        order by
            modifiedAt desc;


    @cds.redirection.target
    view Status_Vendor as
        select * from my.statusList
        where
            code not in (
                'Forwarded', 'In Progress');
// @cds.redirection.target
// view VendorNotifications_U as
//     select * from my.Vendor_Notifications
//     where
//         createdBy = upper($user)
//     order by
//         modifiedBy desc;

// view VendorNotifications_A as
//     select * from Vendor_Notifications
//     where
//         approver = upper($user)
//     order by
//         modifiedBy desc;

}
