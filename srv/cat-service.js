const cds = require('@sap/cds');
const createNoti = require('./createNotification');
const vendorNoti = require('./createVendorNotification');
module.exports = async function () {
    const db = await cds.connect.to('db')
    const {
        Roles,
        Users_Role_Assign,
        Vendor_List,
        User_Approve_Maintain,
        Pricing_Conditions,
        Vendor_Notifications,
        Pricing_Notifications,
        Vendor_Comments,
        Pricing_Comments
    } = db.entities("ferrero.mro");
    this.on("READ", "CheckUserRole", async (req, next) => {
        var result;
        var logOnUser = req.user.id.toUpperCase();
        // console.log("log on user:   " + req.user);
        if (logOnUser && logOnUser !== "") {
            try {
                result = await SELECT.from(Users_Role_Assign).where({ userid: req.user.id.toUpperCase() });
            } catch (err) {
                req.reject(500, "logon user unavailable");
            }
            return result;
        } else {
            req.reject(500, "logon user unavailable");
        }
    });
    this.before("INSERT", "PricingConditions", async (req, next) => {
        try {
            var result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id.toUpperCase() });
            if (result.length > 0) {
                req.data.approver = result[0].managerid;
                req.data.initiator = req.user.id.toUpperCase();
                req.data.status_code = "Pending";
                req.data.initiator = req.user.id.toUpperCase();
                req.data.uuid = cds.utils.uuid();

                if (req.data.p_notif) {
                    req.data.p_notif.Pricing_Conditions_manufacturerCode = req.data.manufacturerCode;
                    req.data.p_notif.Pricing_Conditions_countryCode = req.data.countryCode;
                    req.data.p_notif.approver = result[0].managerid;
                    req.data.p_notif.status_code = "Pending";
                }

                return req;
            } else {
                req.reject(400, "Manager not assigned", "Please assign manager to the user " + req.user.id.toUpperCase());
            }
        } catch (err) {
            req.reject("500", err);
        }
    });


    this.before("INSERT", "VendorList", async (req, next) => {
        var logOnUser = req.user.id.toUpperCase();
        try {
            result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id.toUpperCase() });
            if (result.length > 0) {
                req.data.approver = result[0].managerid;
                req.data.initiator = req.user.id.toUpperCase();
                req.data.status_code = "Pending";
                req.data.uuid = cds.utils.uuid();

                if (req.data.v_notif) {
                    req.data.v_notif.Vendor_List_manufacturerCode = req.data.manufacturerCode;
                    req.data.v_notif.Vendor_List_localManufacturerCode = req.data.localManufacturerCode;
                    req.data.v_notif.Vendor_List_countryCode = req.data.countryCode;
                    req.data.v_notif.approver = result[0].managerid;
                    req.data.v_notif.status_code = "Pending";
                }

                return req;
            } else {
                req.reject(400, "Manager not assigned", "Please assign manager to the user " + req.user.id.toUpperCase());
            }
        } catch (err) {
            req.reject("500", err);
        }
    });

    this.after("INSERT", "VendorList", async (req, next) => {
        try {
            result = await SELECT.from("UserDetails").where({ userid: req.approver });
            var mailId, managerid;
            if (result.length > 0) {
                managerid = result[0].managerid;
                mailId = result[0].mail_id;
                // var oManagerInfo = await SELECT.one(Users_Role_Assign).where({ userid: managerid });
            }

            // await INSERT.into(Vendor_Notifications).entries({
            //     "uuid": cds.utils.uuid(),
            //     "approver": req.approver,
            //     "Vendor_List_manufacturerCode": req.manufacturerCode,
            //     "Vendor_List_localManufacturerCode": req.localManufacturerCode,
            //     "Vendor_List_countryCode": req.countryCode,
            //     "status_code": "Pending"
            // });
            // await createNoti.mainPayload({
            //     manufacturerCode: req.manufacturerCode,
            //     countryCode: req.countryCode,
            //     from_mail: req.initiator,
            //     recipients: [mailId],
            //     priority: "High"
            // });
            await vendorNoti.mainPayload({
                requestType: "New",
                requestDetail: "Manufacturer- " + req.manufacturerCode + " & Local Manufacturer- " + req.localManufacturerCode
                    + " & Country- " + req.countryCode,
                from_user: req.initiator,
                recipients: [mailId],
                priority: "High"
            });
        } catch (err) {
            req.reject(400, err);
        }
        return req;
    });

    this.after("INSERT", "PricingConditions", async (req, next) => {
        // var finalInfo = await next();
        result = await SELECT.from("UserDetails").where({ userid: req.approver });
        var mailId, managerid;
        if (result.length > 0) {
            managerid = result[0].managerid;
            mailId = result[0].mail_id;
            // var oManagerInfo = await SELECT.one(Users_Role_Assign).where({ userid: managerid });
        }
        // await INSERT.into(Pricing_Notifications).entries({
        //     "uuid": cds.utils.uuid(),
        //     "approver": req.approver,
        //     "Pricing_Conditions_manufacturerCode": req.manufacturerCode,
        //     "Pricing_Conditions_countryCode": req.countryCode,
        //     "status_code": "Pending"
        // });
        await createNoti.mainPayload({
            requestType: "New",
            requestDetail: "Manufacturer- " + req.manufacturerCode + " & Country- " + req.countryCode,
            from_user: req.initiator,
            recipients: [mailId],
            priority: "High"
        });
        return req;
    });

    this.before("INSERT", "VendorComments", async (req, next) => {
        var logOnUser = req.user.id.toUpperCase();
        // req.data.initiator = req.user.id.toUpperCase();
        req.data.uuid = cds.utils.uuid();
        return req;
    });
    this.before("INSERT", "PricingComments", async (req, next) => {
        var logOnUser = req.user.id.toUpperCase();
        // req.data.initiator = req.user.id.toUpperCase();
        req.data.uuid = cds.utils.uuid();
        return req;
    });

    this.on("UPDATE", "PricingNotifications", async (req, next) => {
        var PricingNotifications = await next();
        try {
            // var returnValue = "0";
            oPricingCond = await SELECT.one(Pricing_Conditions).where(
                {
                    manufacturerCode: PricingNotifications.Pricing_Conditions_manufacturerCode,
                    countryCode: PricingNotifications.Pricing_Conditions_countryCode
                }
            );
            oResult = await SELECT.one("UserDetails").where({ userid: oPricingCond.createdBy });
            var mailId, managerid;
            if (oResult) {
                mailId = oResult.mail_id;
            }

            await UPDATE('Pricing_Conditions').with({
                status_code: PricingNotifications.status_code
            }).where(
                {
                    manufacturerCode: PricingNotifications.Pricing_Conditions_manufacturerCode,
                    countryCode: PricingNotifications.Pricing_Conditions_countryCode
                }
            );
            // await createNoti.mainPayload({
            //     manufacturerCode: "Manufacturer Code: " + PricingNotifications.Pricing_Conditions_manufacturerCode,
            //     countryCode: "Country Code: " + PricingNotifications.Pricing_Conditions_countryCode,
            //     from_mail: PricingNotifications.approver,
            //     recipients: [mailId],
            //     priority: "High"
            // });
            await createNoti.mainPayload({
                requestType: "Approved",
                requestDetail: "Manufacturer- " + PricingNotifications.Pricing_Conditions_manufacturerCode + " & Country- " + PricingNotifications.Pricing_Conditions_countryCode,
                from_user: PricingNotifications.approver,
                recipients: [mailId],
                priority: "Low"
            });
        } catch (err) {
            req.reject(400, err);
        }
        return PricingNotifications;
    });

    this.on("UPDATE", "VendorNotifications", async (req, next) => {
        var VendorNotifications = await next();
        try {
            oVendList = await SELECT.one(Vendor_List).where(
                {
                    manufacturerCode: VendorNotifications.Vendor_List_manufacturerCode,
                    localManufacturerCode: VendorNotifications.Vendor_List_localManufacturerCode,
                    countryCode: VendorNotifications.Vendor_List_countryCode
                }
            );
            oResult = await SELECT.one("UserDetails").where({ userid: oVendList.createdBy });
            var mailId, managerid;
            if (oResult) {
                mailId = oResult.mail_id;
            }
            await UPDATE('Vendor_List').with({
                status_code: VendorNotifications.status_code
            }).where(
                {
                    manufacturerCode: VendorNotifications.Vendor_List_manufacturerCode,
                    localManufacturerCode: VendorNotifications.Vendor_List_localManufacturerCode,
                    countryCode: VendorNotifications.Vendor_List_countryCode
                }
            );
            // await createNoti.mainPayload({
            //     manufacturerCode: "Manufacturer Code: " + VendorNotifications.Vendor_List_manufacturerCode,
            //     countryCode: "Country Code: " + VendorNotifications.Vendor_List_localManufacturerCode,
            //     from_mail: req.user.id.toUpperCase(),
            //     recipients: [mailId],
            //     priority: "High"
            // });

            await vendorNoti.mainPayload({
                requestType: "Approved",
                requestDetail: "Manufacturer- " + VendorNotifications.Vendor_List_manufacturerCode + " & Local Manufacturer- " + VendorNotifications.Vendor_List_localManufacturerCode
                    + " & Country- " + VendorNotifications.Vendor_List_countryCode,
                from_user: req.user.id.toUpperCase(),
                recipients: [mailId],
                priority: "High"
            });

        } catch (err) {
            req.reject(400, err);
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
                approver: req.user.id.toUpperCase()
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
            await createNoti.mainPayload({
                manufacturerCode: "Manufacturer Code: " + req.data.manufacturerCode,
                countryCode: "Country Code: " + req.data.countryCode,
                from_mail: req.user.id.toUpperCase(),
                recipients: ["SrinivasaReddy.BUTUKURI@guest.ferrero.com", "Divya.EMURI@guest.ferrero.com",
                    "butuksrin1@ferrero.com"],
                priority: "Low"
            });
            // }
            return 0;
        } catch (err) {
            req.reject(400, err);
        }
    });

    this.on("INSERT", "VendorComments", async (req, next) => {
        var VendorComments = await next();
        try {
            oVendList = await SELECT.one(Vendor_List).where(
                {
                    manufacturerCode: VendorComments.Vendor_List_manufacturerCode,
                    localManufacturerCode: VendorComments.Vendor_List_localManufacturerCode,
                    countryCode: VendorComments.Vendor_List_countryCode
                }
            );
            oResult = await SELECT.one("UserDetails").where({ userid: oVendList.createdBy });
            var mailId, managerid;
            if (oResult) {
                mailId = oResult.mail_id;
            }

            await UPDATE('Vendor_Notifications').with({
                status_code: "Rejected",
                approver: req.user.id.toUpperCase(),
                approvedDate: new Date().toISOString(),
                completionDate: new Date().toISOString()
            }).where(
                {
                    uuid: VendorComments.vendor_Notif_uuid
                }
            );
            await UPDATE('Vendor_List').with({
                status_code: "Rejected"
            }).where(
                {
                    manufacturerCode: VendorComments.Vendor_List_manufacturerCode,
                    localManufacturerCode: VendorComments.Vendor_List_localManufacturerCode,
                    countryCode: VendorComments.Vendor_List_countryCode
                }
            );
            // await createNoti.mainPayload({
            //     manufacturerCode: "Manufacturer Code: " + VendorComments.Vendor_List_manufacturerCode,
            //     countryCode: "Country Code: " + VendorComments.Vendor_List_countryCode,
            //     from_mail: req.user.id.toUpperCase(),
            //     recipients: [mailId],
            //     priority: "High"
            // });
            await vendorNoti.mainPayload({
                requestType: "Rejected",
                requestDetail: "Manufacturer- " + VendorComments.Vendor_List_manufacturerCode + " & Local Manufacturer- " + VendorComments.Vendor_List_localManufacturerCode
                    + " & Country- " + VendorComments.Vendor_List_countryCode,
                from_user: req.user.id.toUpperCase(),
                recipients: [mailId],
                priority: "High"
            });
        } catch (err) {
            req.reject(400, err);
        }
        return VendorComments;
    });
    this.on("INSERT", "PricingComments", async (req, next) => {
        var PricingComments = await next();
        try {
            oPricingCond = await SELECT.one(Pricing_Conditions).where(
                {
                    manufacturerCode: PricingComments.Pricing_Conditions_manufacturerCode,
                    countryCode: PricingComments.Pricing_Conditions_countryCode
                }
            );
            oResult = await SELECT.one("UserDetails").where({ userid: oPricingCond.createdBy });
            var mailId, managerid;
            if (oResult) {
                mailId = oResult.mail_id;
            }

            await UPDATE('Pricing_Notifications').with({
                status_code: "Rejected",
                approver: req.user.id.toUpperCase(),
                approvedDate: new Date().toISOString(),
                completionDate: new Date().toISOString()
            }).where(
                {
                    uuid: PricingComments.pricing_Notif_uuid
                }
            );
            await UPDATE('Pricing_Conditions').with({
                status_code: "Rejected"
            }).where(
                {
                    manufacturerCode: PricingComments.Pricing_Conditions_manufacturerCode,
                    countryCode: PricingComments.Pricing_Conditions_countryCode
                }
            );
            // await createNoti.mainPayload({
            //     manufacturerCode: "Pricing Rejection ===>  Manufacturer Code: " + PricingComments.Pricing_Conditions_manufacturerCode,
            //     countryCode: "Country Code: " + PricingComments.Pricing_Conditions_countryCode,
            //     from_mail: req.user.id.toUpperCase(),
            //     recipients: [mailId],
            //     priority: "High"
            // });
            await createNoti.mainPayload({
                requestType: "Rejected",
                requestDetail: "Manufacturer- " + PricingComments.Pricing_Conditions_manufacturerCode + " & Country- " + PricingComments.Pricing_Conditions_countryCode,
                from_user: req.user.id.toUpperCase(),
                recipients: [mailId],
                priority: "High"
            });
            // }
            // return 0;
        } catch (err) {
            req.reject(400, err);
        }
        return PricingComments;
    });
}