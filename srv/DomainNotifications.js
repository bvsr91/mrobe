const { NotificationService } = require("./util/NotificationAPI");

const NOTIF_TYPE_KEY = "PricingApproval";
const NOTIF_TYPE_VERSION = "1.0";

function createNotificationType() {
    return {
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        Templates: [
            {
                Language: "en",
                TemplatePublic: "A new Pricng Request needs your attention!",
                TemplateSensitive: "Pricing Approval Request for {{manufacturerCode}} and {{countryCode}} from {{from_mail}}",
                TemplateGrouped: "You have Pricing Request(s) for approval",
                TemplateLanguage: "Mustache",
                Subtitle: "Pricing Approval"
            }
        ]
    }
}

function createNotification({ manufacturerCode, countryCode, from_mail, recipients, priority }) {

    return {
        OriginId: "PricingApprovald",
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        NavigationTargetAction: "display",
        NavigationTargetObject: "mro",
        Priority: priority,
        ProviderId: "",
        ActorId: "",
        ActorType: "",
        ActorDisplayText: "",
        ActorImageURL: "",
        Properties: [
            {
                Key: "manufacturerCode",
                Language: "en",
                Value: manufacturerCode,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "countryCode",
                Language: "en",
                Value: countryCode,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "from_mail",
                Language: "en",
                Value: from_mail,
                Type: "String",
                IsSensitive: false
            }
        ],
        Recipients: recipients.map(recipient => ({ RecipientId: recipient })),
    }
}

async function publishNotification(notification) {
    const notifTypes = await NotificationService.getNotificationTypes();
    const notifType = notifTypes.find(nType => nType.NotificationTypeKey === NOTIF_TYPE_KEY && nType.NotificationTypeVersion === NOTIF_TYPE_VERSION);
    if (!notifType) {
        console.log(`Notification Type of key ${NOTIF_TYPE_KEY} and version ${NOTIF_TYPE_VERSION} was not found. Creating it...`);
        await NotificationService.postNotificationType(createNotificationType());
    }
    return await NotificationService.postNotification(createNotification(notification));
}

module.exports = { publishNotification };