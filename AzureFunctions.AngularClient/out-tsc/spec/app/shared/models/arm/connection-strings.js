"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionStringType;
(function (ConnectionStringType) {
    ConnectionStringType[ConnectionStringType["MySql"] = 0] = "MySql";
    ConnectionStringType[ConnectionStringType["SQLServer"] = 1] = "SQLServer";
    ConnectionStringType[ConnectionStringType["SQLAzure"] = 2] = "SQLAzure";
    ConnectionStringType[ConnectionStringType["Custom"] = 3] = "Custom";
    ConnectionStringType[ConnectionStringType["NotificationHub"] = 4] = "NotificationHub";
    ConnectionStringType[ConnectionStringType["ServiceBus"] = 5] = "ServiceBus";
    ConnectionStringType[ConnectionStringType["EventHub"] = 6] = "EventHub";
    ConnectionStringType[ConnectionStringType["ApiHub"] = 7] = "ApiHub";
    ConnectionStringType[ConnectionStringType["DocDb"] = 8] = "DocDb";
    ConnectionStringType[ConnectionStringType["RedisCache"] = 9] = "RedisCache";
    ConnectionStringType[ConnectionStringType["PostgreSQL"] = 10] = "PostgreSQL";
})(ConnectionStringType = exports.ConnectionStringType || (exports.ConnectionStringType = {}));
//# sourceMappingURL=connection-strings.js.map