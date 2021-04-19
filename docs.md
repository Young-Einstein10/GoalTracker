**Few Commands Used While Deploying on Heroku**

- `heroku pg:psql` to connect to remote psql
- `heroku pg:reset` to reset DB
- `heroku pg:info` to view information about DB
- `heroku logs --tail` to view App Logs
- `heroku open` to open app from CLI
- `heroku login` to login to heroku from CLI
- `heroku create` to create an heroku app
- `git push heroku master` to deploy to heroku
- `heroku config:set PGSSLMODE=require` to require SSL Mode when connecting to Database or `PGSSLMODE=no-verify` to avoid using SSL when connecting to Database

**Command used in pushing local postgres DB to remote postgres DB on heroku
**

```bash
PGUSER=postgres PGPASSWORD=obasanjoh heroku pg:push tracker postgresql-trapezoidal-09922 --app einstein-goal-tracker
```

Where postgresql-trapezoidal-09922 = name of remote postgres DB on heroku
einstein-goal-tracker = name of node.js app on heroku

NB: To ensure there are no errors while exporting local DB to heroku, ensure remote postgres is empty or use `heroku pg:reset` to rest DB
