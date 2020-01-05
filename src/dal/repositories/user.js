import DAL from 'dal';
import sql from 'dal/sql';

class User {
    async findByEmail(email) {
        return DAL.execQuerySingle(sql.user.findByEmail, [email]);
    }
}

export default new User();
