import util from 'util';

class Helper {
    async exec(cmd) {
        const execute = util.promisify(require(`child_process`).exec);
        return execute(cmd);
    }

    async series(cmds) {
        /* eslint-disable no-restricted-syntax, no-await-in-loop */
        for (const cmd of cmds) {
            const { stderr, stdout } = await this.exec(cmd);

            if (stderr) {
                console.log(stderr);
                console.log(stdout);
                return stderr;
            }
        }
        return null;
    }
}

export default new Helper();
