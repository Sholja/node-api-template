# About 
Basic API template written in Node.JS

# Setup
- `yarn install`
- `yarn start` 

# Run
- `GET localhost:3000/application/health`

### Application parts below are flagged like this:

* 📒 Folders
* 📑 Files

### Project arhitecture:

* 📒 src
  * 📒 auth
    * 📑 index.js
    * 📑 jwt.js
  * 📒 config
    * 📑 constants.js
    * 📑 environment.js
    * 📑 error-codes.js
    * 📑 index.js
    * 📑 sequelize-constants.js
    * 📑 sequelize.js
  * 📒 dal
    * 📒 migrations
    * 📒 models
    * 📒 repositories
    * 📒 seeders
    * 📒 sql
    * 📑 index.js
  * 📒 endpoints
    * 📒 base
    * 📒 controllers
    * 📒 enums
    * 📒 shared-validators
  * 📒 lib
    * 📒 controller
    * 📒 errors
    * 📒 helper
    * 📒 validator
    * 📑 crypto.js
    * 📑 http.js
    * 📑 index.js
    * 📑 logger.js
    * 📑 response.js
  * 📑 bootstrap.js
  * 📑 index.js
  * 📑 server.js
* 📑 package.json
* 📑 README.md

### How to add a new route:

- First we add SQL file in "src/dal/sql/{{feature_folder}}/{{file_name}}.sql". Now that we have added new SQL file with the query, we have to export the file and make it usable. We do this in "src/dal/sql/index.js" by adding a new function which will return loaded SQL file as string.

  

- Now, after SQL file is loaded, we can use it in repositories ("src/dal/repositories/{{file_name}}.js"). Here, we will use one of the query functions exposed by DAL module and execute our query. The functions are:

1. "execQuery" - This will return SELECT with all rows affected by query.
2. "execQuerySingle" - This will return only one row from DB.
3. "execInsertQuery" - Will make a INSERT in to the DB.
4. "execUpdateQuery" - Will update row in the DB.
5. "execDeleteQuery" - Will delete row from the DB.

- Now, we are done with DB part, so let us move to build route part. We will do this by adding new controller under "src/endpoints/controllers". Routes are separated in groups, so we have for example "auth" (here will be routes regarding authorization, like for example "/login" route), "users" (routes regarding users should be here) etc. Rule of thumb, first part of the route should be folder name, so for example in folder "auth", route for login should be: "/auth/login". Now let us move to the files that can be in one controller.

  
#### Controller files

- One controller can/should have following files:

1. "executor.js" - This file is required and this is where all the magic happens. This is the main entry point of the route. It's pretty much a class which has to implement one sincle method: "execute".

2. "route.js" - Also required file. Here we describe our route. This class need to have two getters: "httpMethod" (here we say route type, is it "POST", "GET", "DELETE" etc.) and "path" (route path, for example "/auth/login"). Beside these two, route.js has one more important getter and that is "authLevel". This one is not required and if not specifed, by default it will be "USER_LOGIN". Now what this getter does? It's a simple middlware to determin route authorization, which user can access to the route. There are few levels of authorization:

    1. "NO_SESSION" - Pretty much as name says, for this route there is no session/authorization. This is used for open routes like for example login, registration, reset passsword etc.
    2. "USER_LOGIN" - This is used for routes which will be accessible for regular users via client app. So, only users with role "USER" can access this route.
    3. "MANAGER_LOGIN" - Another role in the system. With this auth level, routes can be accessed only by users with "MANAGER" role.
    4. "ADMIN" - Yet another role in the system and only users with role "ADMIN" can access this route.
    5. "BY_ROLES" - This auth level is used if we want to grant access to multiple user types to one route. For this auth, you don't have to specify it like this in code, you just write array of auths, for example:

```
<!-- So, to this route, users with role "USER" and "MANAGER" will have access -->

get authLevel() {
	return [enums.authLevel.USER_LOGIN, enums.authLevel.MANAGER_LOGIN];
}
```

3. "schema.js" - This is a validation schema for request. It's not required, but any request should have it, if it makes sense to have. With this schema, we can validate both body in a "POST" request or params in a "GET" request. Example of a body check:

```
<!-- Here, we are validating body with properties email and password. We can say what types

API is epexting as well as specify which fields are required. For params check, instead of

"body", we would write "params" -->

export default class Schema {
	static requestSchema() {
		return {
			"type": "object",
			"properties": {
			"body": {
				"type": "object",
				"properties": {
					"email": {
						"type": "string"
					},
					"password": {
						"type": "string"
					}
				},
				"required": [
					"email",
					"password"
				]
			}
		},
			"required": [
				"body"
			]
		};
	}
}
```

4. "validator.js" - This one is optional as well and is used for request validation. Pretty much, if there is something we can't validate using schema, for example we need some data from DB, we can do that here. Here is an example of validating Date of Birth:

```
import moment from 'moment';
import {
	dateHelper,
	response as Response,
	errors
} from 'lib';
import constants from 'config/constants';

class Validator {
	async validate(req, res, next) {
		const dob = moment(req.body.date_of_birth);
		
		if (dob.isAfter(dateHelper.subtractFromNowInTimestamp(18, `years`))) {
			const response = Response.formatError(errors.generic(`Must be 18+ years old.`, constants.errorCodes.NOT_18_YEARS_OLD));
			res.send(response.info.code, response);
			return next(false);
		}

	return next();
	}
}

export default new Validator();
```

- There is one more thing to add and our route will be done. That is response schema. Although optional, EVERY ROUTE SHOULD HAVE RESPONSE SCHEMA! What we gain by this it's pretty much like testing, we validate what our route is returning. So, we add it to "src/lib/validator/response-validator" folder and also we have to set getter in "src/lib/validator/index.js" if it's not already set. Example of one validator:

```
<!-- So, as we see, for example in login validator, we can say what types of fields route is returning

as well as what fields are required and route should return -->

class AuthValidator {
	constructor() {
		this.initialize();
	}

	get login() {
		return this._login;
	}

	initialize() {
		this._login = {
			type: `object`,
			properties: {
				user_id: { type: [`integer`] },
				email: { type: [`string`] },
				first_name: { type: [`string`] },
				last_name: { type: [`string`] }
			},
			required: [
				`user_id`,
				`email`
			]
		};
	}
}  

export default AuthValidator;
```

- Now that we have addded our response validator, we use it like this in a controller:

```
<!-- We use "validate" method from validator class and pass our validator as well as data to validate -->

return Response.format(data, validator.validate(validator.auth.login, userData));
```


## Authors and contributors

* **Eldin Soljic** - [Sholja](https://github.com/Sholja) - **Software Developer**

See also the list of [contributors](https://github.com/SwipeStoxGmbH/naga-card/graphs/contributors) who participated in this project.

# Happy coding!
