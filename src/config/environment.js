export default [
    { name: `DEFAULT_LANGUAGE`, secret: false, skip: false },
    { name: `DB_DATABASE`, secret: false, skip: false },
    { name: `DB_USERNAME`, secret: false, skip: false },
    { name: `DB_PASSWORD`, secret: false, skip: false },
    { name: `DB_HOST`, secret: false, skip: false },
    { name: `DB_PORT`, secret: false, skip: false },
    { name: `JWT_SECRET`, secret: true, skip: false },
    { name: `JWT_EXPIRATION`, secret: false, skip: false },
    { name: `JWT_ALGORITHM`, secret: true, skip: false }
];
