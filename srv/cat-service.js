const cds = require('@sap/cds');
const createNoti = require('./createNotification');
module.exports = async function () {
    const db = await cds.connect.to('db')
    const {
        Roles,
        Users_Role_Assign,
        Vendor_List,
        User_Approve_Maintain,
        Pricing_Conditions,
        Vendor_Notifications,
        Pricing_Notifications
    } = db.entities("ferrero.mro");
    this.on("READ", "CheckUserRole", async (req, next) => {
        var result;
        var logOnUser = req.user.id;
        if (logOnUser && logOnUser !== "") {
            try {
                result = await SELECT.from(Users_Role_Assign).where({ userid: req.user.id });
            } catch (err) {
                return err;
            }
            return result;
        } else {
            req.error(500, "logon user unavailable");
        }
    });
    this.before("INSERT", "PricingConditions", async (req, next) => {
        try {
            var result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id });
            if (result.length > 0) {
                req.data.approver = result[0].managerid;
                req.data.initiator = req.user.id;
                req.data.status_code = "Pending";
                req.data.initiator = req.user.id;
                req.data.uuid = cds.utils.uuid();
                return req;
            } else {
                req.error("Please assign manager to the user " + req.user.id);
            }
        } catch (err) {
            req.error("500", error);
        }
    });


    this.before("INSERT", "VendorList", async (req, next) => {
        var logOnUser = req.user.id;
        try {
            result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id });
            if (result.length > 0) {
                req.data.approver = result[0].managerid;
                req.data.initiator = req.user.id;
                req.data.status_code = "Pending";
                req.data.uuid = cds.utils.uuid();
                return req;
            } else {
                req.error("Please assign manager to the user " + req.user.id);
            }
        } catch (err) {
            req.error("500", error);
        }
    });

    this.after("INSERT", "VendorList", async (req, next) => {
        try {
            await INSERT.into(Vendor_Notifications).entries({
                "uuid": cds.utils.uuid(),
                // "ref_id": req.uuid,
                "Vendor_List_manufacturerCode": req.manufacturerCode,
                "Vendor_List_localManufacturerCode": req.localManufacturerCode,
                "Vendor_List_countryCode": req.countryCode,
                "status_code": "Pending"
            });
        } catch (err) {
            req.error("500", error);
        }
        // req.data.uuid = cds.utils.uuid();
        return req;
    });

    this.after("INSERT", "PricingConditions", async (req, next) => {
        // var finalInfo = await next();
        result = await SELECT.from(Users_Role_Assign).where({ userid: req.approver });
        var mailId;
        if (result.length > 0) {
            mailId = result[0].mail_id;
        }
        await INSERT.into(Pricing_Notifications).entries({
            "uuid": cds.utils.uuid(),
            // "ref_id": req.uuid,
            "Pricing_Conditions_manufacturerCode": req.manufacturerCode,
            "Pricing_Conditions_countryCode": req.countryCode,
            "status_code": "Pending"
        });
        createNoti.mainPayload({
            manufacturerCode: req.manufacturerCode,
            countryCode: req.countryCode,
            from_mail: req.initiator,
            recipients: ["SrinivasaReddy.BUTUKURI@guest.ferrero.com", "Divya.EMURI@guest.ferrero.com",
                "Janbunathan.PRIYADHARSHINI@guest.ferrero.com"],
            priority: "High"
        });
        return req;
    });

    this.before("INSERT", "VendorComments", async (req, next) => {
        var logOnUser = req.user.id;
        // req.data.initiator = req.user.id;
        req.data.uuid = cds.utils.uuid();
        return req;
    });
    this.before("INSERT", "PricingComments", async (req, next) => {
        var logOnUser = req.user.id;
        // req.data.initiator = req.user.id;
        req.data.uuid = cds.utils.uuid();
        return req;
    });

    this.on("UPDATE", "PricingNotifications", async (req, next) => {
        var PricingNotifications = await next();
        try {
            // var returnValue = "0";
            await UPDATE('Pricing_Conditions').with({
                status_code: PricingNotifications.status_code
            }).where(
                {
                    manufacturerCode: PricingNotifications.Pricing_Conditions_manufacturerCode,
                    countryCode: PricingNotifications.Pricing_Conditions_countryCode
                }
            );
            await createNoti.mainPayload({
                product: "Manufacturer Code: " + PricingNotifications.Pricing_Conditions_manufacturerCode,
                category: "Country Code: " + PricingNotifications.Pricing_Conditions_countryCode,
                stock: "434543",
                recipients: ["SrinivasaReddy.BUTUKURI@guest.ferrero.com", "Divya.EMURI@guest.ferrero.com",
                    "Janbunathan.PRIYADHARSHINI@guest.ferrero.com"]
            });
            // }
            // return 0;
        } catch (err) {
            req.error(err);
        }
        return PricingNotifications;
    });

    this.on("UPDATE", "VendorNotifications", async (req, next) => {
        var VendorNotifications = await next();
        try {
            // var returnValue = "0";
            await UPDATE('Vendor_List').with({
                status_code: VendorNotifications.status_code
            }).where(
                {
                    manufacturerCode: VendorNotifications.Vendor_List_manufacturerCode,
                    localManufacturerCode: VendorNotifications.Vendor_List_localManufacturerCode,
                    countryCode: VendorNotifications.Vendor_List_countryCode
                }
            );
            await createNoti.mainPayload({
                product: "Manufacturer Code: " + VendorNotifications.Vendor_List_manufacturerCode,
                category: "Country Code: " + VendorNotifications.Vendor_List_localManufacturerCode,
                stock: "434543",
                recipients: ["SrinivasaReddy.BUTUKURI@guest.ferrero.com", "Divya.EMURI@guest.ferrero.com",
                    "Janbunathan.PRIYADHARSHINI@guest.ferrero.com"]
            });
            
            // }
            // return 0;
        } catch (err) {
            req.error(err);
        }
        return VendorNotifications;
    });

    this.on("approvePricing", async req => {
        try {
            var returnValue = "0";
            var result = await UPDATE(Pricing_Notifications).with({
                status_code: "Approved",
                approvedDate: new Date().toISOString(),
                completionDate: new Date().toISOString(),
                approver: req.user.id
            }).where({
                uuid: req.data.uuid
            });
            if (result === 1) {
                var result = await UPDATE(Pricing_Conditions).with({
                    status_code: "Approved",
                    exchangeRate: 3.3
                }).where(
                    {
                        manufacturerCode: req.data.manufacturerCode,
                        countryCode: req.data.countryCode
                    }
                );
                if (result === 0) {
                    await UPDATE(Pricing_Conditions).with({
                        status_code: "Approved",
                        exchangeRate: 3.3
                    }).where(
                        {
                            manufacturerCode: req.data.manufacturerCode,
                            countryCode: req.data.countryCode
                        }
                    );
                }
            }
            createNoti.mainPayload({
                product: "Manufacturer Code: " + req.data.manufacturerCode,
                category: "Country Code: " + req.data.countryCode,
                stock: "434543",
                recipients: ["SrinivasaReddy.BUTUKURI@guest.ferrero.com", "Divya.EMURI@guest.ferrero.com",
                    "butuksrin1@ferrero.com"]
            });
            // }
            return 0;
        } catch (err) {
            req.error(err);
        }
    });
}