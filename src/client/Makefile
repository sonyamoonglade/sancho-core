build:
	docker build -t zharpizza-front .
create:
	heroku create zharpizza-front --buildpack https://github.com/mars/create-react-app-buildpack.git && heroku git:remote -a zharpizza-front && git add . && git commit -m "deploy-commit" && git push heroku master
changes:
	tar cf - --exclude=node_modules --exclude=.env . | (cd ../../../deploy-client && tar xvf -) && cd ../../../deploy-client && git add . && git commit -m "deploy" && git push heroku master

push-h-git:
	git push heroku master
push-h:
	heroku container:push web --app zharpizza-front
release-h:
	heroku container:release web --app zharpizza-front

open-h:
	heroku open --app zharpizza-front

logs-h:
	heroku logs --tail --app zharpizza-front

unrelease-h:
	heroku container:rm web --app zharpizza-front

undeploy-h:
	heroku apps:destroy --app zharpizza-front --confirm zharpizza-front

deploy:
	heroku container:login && $(MAKE) build && $(MAKE) push-h && $(MAKE) release-h