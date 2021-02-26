# COVID Health Tracker Backend

## Setup

### Node

Install the node dependencies using `npm i`.

To run in development mode with file watching, use the command `npm run dev`.

To run normally, use the command `npm run start`.

### .env Files

Use the `.env.template` file to create a `.env.local` file for development on your local machine.

The environment variables that will need to be changed are your MySQL username and password.

### Database

The database is running [MySQL](https://www.mysql.com/).

Download MySQL if your machine does not have it installed already.

Using the SQL statements in `database/`:

- Create a local `cht` database
- Create a table `users` in that database

If you haven't used MySql on your machine before, you may need to update the username and password in order to create these entities.

### React Build

Use the `copy_react_build.sh` script from the root directory to build the React Application and copy the build to the backend to serve.

## Routes

Route | Description
--- | ---
`/auth/signup` | Registers Users
`/auth/login` | Authenticates Users
`*` | Serves the React Build
