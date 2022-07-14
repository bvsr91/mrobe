namespace ferrero.mro;

using {
    managed,
    cuid,
    Currency,
    Country,
    sap.common,
    sap.common.CodeList
} from '@sap/cds/common';

entity Roles {
    key role        : String(3);
        description : String;
}

entity Users_Role_Assign {
    key userid  : String(30);
        role    : Association to Roles;
        mail_id : String;
        country : String(3); //mandatory for LDT and LP
}

entity User_Approve_Maintain {
    key userid    : String(30);
    key managerid : String(30);
}

entity Vendor_List : managed {
    key manufacturerCode          : String(10);
    key localManufacturerCode     : String(10);
        // @Consumption.filter.hidden : true
    key countryCode               : String(3);
        countryDesc               : String;
        uuid                      : UUID;
        manufacturerCodeDesc      : String(35);
        localManufacturerCodeDesc : String(35);
        initiator                 : String(10);
        approver                  : String(10);
        // status                    : String(10);
        status                    : Association to statusList;
}

entity Pricing_Conditions : managed {
    key manufacturerCode     : String(10);
    key countryCode          : String(3);
        countryDesc          : String;
        uuid                 : UUID;
        manufacturerCodeDesc : String(35);
        localCurrency        : String(3);
        exchangeRate         : Decimal(4, 2);
        countryFactor        : Decimal(4, 2);
        validityStart        : Date;
        validityEnd          : Date;
        initiator            : String;
        approver             : String;
        ld_initiator         : String;
        local_ownership      : Boolean;
        // to_status            : Association to statusList;
        // status               : String(10);
        status               : Association to statusList;
}

// entity statusList CodeList {{
//             key code        : String(10);
//         criticality : Integer; //  2: yellow colour,  3: green colour, 0: unknown
// }
entity statusList : CodeList {
        @UI.Hidden       : true
        @UI.HiddenFilter : true
    key code                    : String enum {
            P = 'Pending';
            A = 'Approved';
            R = 'Rejected';
            D = 'Deleted';
        } default 'Pending'; //> will be used for foreign keys as well
        criticality             : Integer; //  2: yellow colour,  3: green colour, 0: unknown
        createDeleteHidden      : Boolean;
        insertDeleteRestriction : Boolean; // = NOT createDeleteHidden
}


entity countriesCodeList {
    key code : String(3) @description : 'Country Code';
        desc : String    @description : 'Description';
}

// @cds.autoexpose
entity Vendor_Comments : managed {
    key uuid        : UUID;
        Comment     : String;
        Vendor_List : Association to Vendor_List;
}

entity Pricing_Comments : managed {
    key uuid               : UUID;
        Comment            : String;
        Pricing_Conditions : Association to Pricing_Conditions;
}

entity Pricing_Notifications : managed {
    key uuid               : UUID;
        approvedDate       : Timestamp;
        approver           : String;
        status             : Association to statusList;
        completionDate     : Timestamp;
        Pricing_Conditions : Association to Pricing_Conditions;
}

entity Vendor_Notifications : managed {
    key uuid           : UUID;
        approvedDate   : Timestamp;
        approver       : String;
        completionDate : Timestamp;
        status         : Association to statusList;
        Vendor_List    : Association to Vendor_List;
}
