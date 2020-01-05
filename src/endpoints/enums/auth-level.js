class AuthLevel {
    constructor() {
        this.NO_SESSION = `NO_SESSION`;
        this.USER_LOGIN = `USER_LOGIN`;
        this.MANAGER_LOGIN = `MANAGER_LOGIN`;
        this.ADMIN_LOGIN = `ADMIN_LOGIN`;
        this.ANY_LOGIN = `ANY_LOGIN`;
        this.SIGNAL_SERVER = `SIGNAL_SERVER`;
        this.BY_ROLES = `BY_ROLES`;
    }
}

export default new AuthLevel();
