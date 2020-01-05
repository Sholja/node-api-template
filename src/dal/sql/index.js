import fs from 'fs';

class SQL {
    get role() {
        return {
            findById: this.load(`role/find-by-id.sql`),
            findByUserId: this.load(`role/find-by-user-id.sql`)
        };
    }

    get user() {
        return {
            findByEmail: this.load(`user/find-by-email.sql`)
        };
    }

    load(file) {
        const sqlQuery = fs.readFileSync(`${__dirname}/${file}`)
            .toString()
            .replace(/(\r\n|\n|\r)/gm, ` `)
            .replace(/\s+/g, ` `);

        return sqlQuery;
    }
}

const sql = new SQL();
export default sql;
