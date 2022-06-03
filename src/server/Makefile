build:
	 cd ../.. && docker build -t zharpizza-backend . && heroku container:login
push-h:
	 cd ../.. && heroku container:push web --app zharpizza-backend
release-h:
	 cd ../.. && heroku container:release web --app zharpizza-backend
open-h:
	heroku open --app zharpizza-backend
logs-h:
	heroku logs --tail --app zharpizza-backend

deploy:
	cd ../.. && heroku container:rm web --app zharpizza-backend \
 	&& heroku container:push web --app zharpizza-backend \
  	&& heroku container:release web --app zharpizza-backend

