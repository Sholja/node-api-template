import config from 'config';
import Sequelize from 'sequelize';

import User from './models/user';
import Role from './models/role';

/** Main Data access facility */
class DAL {
    constructor() {
        this.setupSequelize();
        this.setupModels();
        this.setupRepos();
        this.init();
    }

    setupSequelize() {
        this._sequelize = new Sequelize(config.DB);
    }

    /** Setup all models */
    setupModels() {
        this._models = {
            User: User.init(this._sequelize, Sequelize),
            Role: Role.init(this._sequelize, Sequelize)
        };
    }

    /** Setup all repos that are to be exposed */
    setupRepos() {
        this.user = require(`./repositories/user`).default;
        this.role = require(`./repositories/role`).default;
    }

    /** Initialize the connection to the DB */
    init() {
        // Run `.associate` if it exists,
        // ie create relationships in the ORM
        Object.values(this._models)
            .filter(model => typeof model.associate === `function`)
            .forEach(model => model.associate(this._models));

        this.DB = {
            ...this._models,
            sequelize: this._sequelize
        };
    }

    async execQuery(query, options) {
        return this._sequelize.query(query, {
            bind: options,
            nest: true
        });
    }

    async execQuerySingle(query, options) {
        return this._sequelize.query(query, {
            bind: options,
            nest: true,
            plain: true
        });
    }

    async execInsertQuery(query, options) {
        return this._sequelize.query(query, {
            type: this._sequelize.QueryTypes.INSERT,
            nest: true,
            bind: options
        });
    }

    async execUpdateQuery(query, options) {
        return this._sequelize.query(query, {
            type: this._sequelize.QueryTypes.UPDATE,
            nest: true,
            bind: options
        });
    }

    async execDeleteQuery(query, options) {
        return this._sequelize.query(query, {
            type: this._sequelize.QueryTypes.DELETE,
            nest: true,
            bind: options
        });
    }
}

export default new DAL();
