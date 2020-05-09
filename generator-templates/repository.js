const RepositoryTemplate = () => {
    const create = className => `import DAL from 'dal';
import sql from '../sql';

class ${className} {}

export default new ${className}();
  `;

    return Object.freeze({
        create
    });
};

module.exports = RepositoryTemplate;
