
login-h:
	 heroku container:login
push-h:
	 heroku container:push web --app zharpizza-backend
release-h:
	 heroku container:release web --app zharpizza-backend
open-h:
	heroku open --app zharpizza-backend
logs-h:
	heroku logs --tail --app zharpizza-backend

runs:
	npm run start:dev
runf:
	cd src/client && npm start
changes-frontend:
	cd src/client && tar cf - --exclude=node_modules --exclude=.env . | (cd ../../../deploy-client && tar xvf -) && cd ../../../deploy-client && git add . && git commit -m "deploy" && git push heroku master

migrate-down:
	npm run migrate down && npm run migrate down && npm run migrate down && npm run migrate down && npm run migrate down && npm run migrate down

migrate-up:
	npm run migrate up

build-backend-local:
	docker build -f ./docker/local.Dockerfile -t sonyamoonglade/sancho-hub:backend-core .

push-backend-local:
	docker push sonyamoonglade/sancho-hub:backend-core

build-backend-prod:
	docker build -f ./docker/prod.Dockerfile -t sonyamoonglade/sancho-hub:backend-core-prod . && docker push sonyamoonglade/sancho-hub:backend-core-prod

cp-env:
	cp .env.prod ../../deployment/sancho/backend/