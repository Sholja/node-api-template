const readline = require(`readline`);
const fs = require(`fs`);

const RepositoryTemplate = require(`./generator-templates/repository`);
const ExecutorTemplate = require(`./generator-templates/executor-template`);
const RouteTemplate = require(`./generator-templates/route-template`);
const SchemaTemplate = require(`./generator-templates/schema-template`);

const repositoryTemplate = RepositoryTemplate();
const executorTemplate = ExecutorTemplate();
const routeTemplate = RouteTemplate();
const schemaTemplate = SchemaTemplate();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const defaultFolder = `${__dirname}/src`;

const createFolder = path => new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        resolve();
    }
});

const createFile = (path, content) => new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
        if (err) {
            throw err;
        }

        return resolve();
    });
});

const createSqlFile = () => new Promise((resolve, reject) => {
    rl.question(`Please enter FOLDER in which to create SQL file (if already exists, will skip folder creation): `, async (folder) => {
        const path = `${defaultFolder}/dal/sql/${folder}`;
        if (!fs.existsSync(path)) {
            await createFolder(path);
        }
        rl.question(`Now, enter SQL FILE NAME (please make it in this form => find-by-id.sql): `, async (file) => {
            await createFile(`${path}/${file}`, ``);
            resolve();
        });
    });
});

const createRepository = () => new Promise((resolve, reject) => {
    rl.question(`Do you need new REPOSITORY CLASS? [y/N] \n`, async (answer) => {
        if (answer === `y` || answer === `yes`) {
            rl.question(`Please enter the NAME of the FILE (for example => user.js): `, async (file) => {
                rl.question(`Please enter the NAME of the CLASS (for example => User): `, async (className) => {
                    const content = repositoryTemplate.create(className);
                    const path = `${defaultFolder}/dal/repositories/${file}`;
                    await createFile(path, content);
                    resolve();
                });
            });
        } else {
            resolve();
        }
    });
});

const createController = () => new Promise((resolve, reject) => {
    rl.question(`Please enter FOLDER in which to create CONTROLLER files (if already exists, will skip folder creation): `, async (folder) => {
        const path = `${defaultFolder}/endpoints/controllers/${folder}`;
        if (!fs.existsSync(path)) {
            await createFolder(path);
        }
        rl.question(`Please enter FEATURE FOLDER (for example => reset-password): `, async (featureFolder) => {
            const controllerPath = `${path}/${featureFolder}`;
            await createFolder(controllerPath);
            const controllerContent = executorTemplate.create();
            const routeContent = routeTemplate.create();
            const schemaContent = schemaTemplate.create();
            await createFile(`${controllerPath}/executor.js`, controllerContent);
            await createFile(`${controllerPath}/route.js`, routeContent);
            await createFile(`${controllerPath}/schema.js`, schemaContent);
            resolve();
        });
    });
});

const start = () => {
    rl.question(`Hi. My name is NiGi and I am a very "smart" bot. I am here to help you create some cool stuff. So let us start. \n\nWill the route you are creating, have SQL STATEMENTS? [y/N] \n`, async (answer) => {
        if (answer === `y` || answer === `yes`) {
            await createSqlFile();
        }

        await createRepository();
        await createController();
        rl.close();
    });
};

start();
