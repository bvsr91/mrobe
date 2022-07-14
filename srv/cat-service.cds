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
    ])                   as projection on my.Roles;

    entity Users @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Users_Role_Assign;

    entity MaintainApproval @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.User_Approve_Maintain;

    entity VendorList @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Vendor_List;

    entity PricingConditions @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Pricing_Conditions;

    entity StatusCodeList @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.statusList;

    entity CountriesCodeList @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.countriesCodeList;
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
    ])                   as projection on my.Vendor_Comments;

    entity PricingComments @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Pricing_Comments;

    entity PricingNotifications @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Pricing_Notifications;

    entity VendorNotifications @(restrict : [
        {
            grant : 'READ',
            to    : 'mrobeReadOnly_sc'
        },
        {
            grant : ['*'],
            to    : 'mrobeUser_sc'
        }
    ])                   as projection on my.Vendor_Notifications;

    @(restrict : [{
        grant : ['*'],
        to    : 'mrobeUser_sc'
    }])
    action approvePricing(uuid : String, manufacturerCode : String, countryCode : String) returns String;

    @readonly
    entity CheckUserRole as projection on my.Users_Role_Assign;

}
