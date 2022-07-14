using MroService from './cat-service';

// annotate MroService.VendorList with {
//     manufacturerCode
// }

annotate MroService.VendorList with @(UI : {
    LineItem        : [
        {
            $Type                 : 'UI.DataField',
            Value                 : manufacturerCode,
            ![@UI.Importance]     : #High,
            ![@HTML5.CssDefaults] : {width : '10rem'}
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : manufacturerCodeDesc,
            ![@HTML5.CssDefaults] : {width : '8rem'},
            ![@UI.Importance]     : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : localManufacturerCode,
            ![@HTML5.CssDefaults] : {width : '10rem'},
            ![@UI.Importance]     : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : localManufacturerCodeDesc,
            ![@UI.Importance] : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : countryCode,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : countryDesc,
            ![@UI.Importance] : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : status_code,
            Criticality           : status.criticality,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : initiator,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : approver,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : createdAt,
            ![@UI.Importance] : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : createdBy,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value             : modifiedAt,
            ![@UI.Importance] : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : modifiedBy,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #Low
        }
    ],
    SelectionFields : [
        manufacturerCode,
        localManufacturerCode,
        countryCode,
        status_code
    ],
});


annotate MroService.PricingConditions with @(UI : {

    LineItem        : [
        {
            $Type                 : 'UI.DataField',
            Value                 : manufacturerCode,
            ![@HTML5.CssDefaults] : {width : '10rem'},
            ![@UI.Importance]     : #High
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : countryCode,
            ![@HTML5.CssDefaults] : {width : '10rem'},
            ![@UI.Importance]     : #High
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : countryFactor,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #Medium
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : exchangeRate,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : local_ownership,
            ![@UI.Importance] : #High
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : status_code,
            ![@HTML5.CssDefaults] : {width : '8rem'},
            Criticality           : status.criticality,
            ![@UI.Importance]     : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : manufacturerCodeDesc,
            ![@UI.Importance] : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value             : countryDesc,
            ![@UI.Importance] : #Low
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : localCurrency,
            ![@HTML5.CssDefaults] : {width : '5rem'},
            ![@UI.Importance]     : #Medium
        },
        {
            $Type                 : 'UI.DataField',
            Value                 : validityStart,
            ![@HTML5.CssDefaults] : {width : '7rem'},
            ![@UI.Importance]     : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : validityEnd,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : initiator,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : ld_initiator,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : approver,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : approver,
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Value             : createdAt,
            ![@UI.Importance] : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value             : createdBy,
            ![@UI.Importance] : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value             : modifiedAt,
            ![@UI.Importance] : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value             : modifiedBy,
            ![@UI.Importance] : #Low
        }
    ],
    SelectionFields : [
        manufacturerCode,
        countryCode,
        status_code
    ],
    HiddenFilter    : [
        initiator,
        approver
    ]
});


annotate MroService.VendorNotifications with @(UI : {LineItem : [
    {
        $Type             : 'UI.DataField',
        Value             : Vendor_List_manufacturerCode,
        ![@UI.Importance] : #High,
        Label             : 'Manufacturer'
    },
    {
        $Type             : 'UI.DataField',
        Value             : Vendor_List_localManufacturerCode,
        ![@UI.Importance] : #High,
        Label             : 'Local Manufacturer'
    },
    {
        $Type             : 'UI.DataField',
        Value             : Vendor_List_countryCode,
        ![@UI.Importance] : #High,
        Label             : 'Country'
    },
    {
        $Type                 : 'UI.DataField',
        Value                 : status_code,
        Criticality           : status.criticality,
        ![@HTML5.CssDefaults] : {width : '7rem'},
        ![@UI.Importance]     : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdAt,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdBy,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : completionDate,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : approver,
        ![@UI.Importance] : #Medium
    }

]});

annotate MroService.PricingNotifications with @(UI : {LineItem : [
    {
        $Type                 : 'UI.DataField',
        Value                 : Pricing_Conditions_manufacturerCode,
        ![@UI.Importance]     : #High,
        ![@HTML5.CssDefaults] : {width : '10rem'},
        Label                 : 'Manufacturer'
    },
    {
        $Type                 : 'UI.DataField',
        Value                 : Pricing_Conditions_countryCode,
        ![@UI.Importance]     : #High,
        ![@HTML5.CssDefaults] : {width : '10rem'},
        Label                 : 'Country'
    },
    {
        $Type                 : 'UI.DataField',
        Value                 : status_code,
        Criticality           : status.criticality,
        ![@HTML5.CssDefaults] : {width : '7rem'},
        ![@UI.Importance]     : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdAt,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : completionDate,
        ![@UI.Importance] : #Medium
    },
    {
        $Type                 : 'UI.DataField',
        Value                 : approver,
        ![@HTML5.CssDefaults] : {width : '8rem'},
        ![@UI.Importance]     : #Medium
    },
    {
        $Type                 : 'UI.DataField',
        Value                 : createdBy,
        ![@HTML5.CssDefaults] : {width : '8rem'},
        ![@UI.Importance]     : #Medium
    }

]});
