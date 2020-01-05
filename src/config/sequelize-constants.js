module.exports = {
    TABLES: {
        USERS: `users`,
        ROLES: `roles`,
        USER_ROLES: `user_roles`
    },
    PRIMARY_KEYS: {
        USERS: `user_id`,
        ROLES: `role_id`
    },
    DATA_TYPES: {
        TIMESTAMP: `TIMESTAMP`,
        TIMESTAMP_NULL: `TIMESTAMP NULL`
    },
    LITERALS: {
        CURRENT_TIMESTAMP: `CURRENT_TIMESTAMP`
    },
    ALIASES: {
        USER: `user`,
        USERS: `users`
    },
    FORMATS: {
        DATE: `YYYY-MM-DD HH:mm:ss`
    }
};
