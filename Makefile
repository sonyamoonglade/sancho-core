
build-client-dev:
	cd src/client && docker build -t client:latest --build-arg BACKEND_URL=http://localhost:5000/api/v1 .

build-server-dev:
	docker build -t server:latest .

run-server-only:
	docker run -p 5000:5000 --name backend --env-file ./.env.dev -d server:latest

drop-migrations:
	npm run migrate down

kill-server:
	docker rm -f backend

run-dev:
	MAKE run-server-only && cd src/client && npm start

run-local-server:
	npm run start:dev
run-local-frontend:
	cd src/client && npm start

changes-frontend:
	cd src/client && tar cf - --exclude=node_modules --exclude=.env . | (cd ../../../deploy-client && tar xvf -) && cd ../../../deploy-client && git add . && git commit -m "deploy" && git push heroku master



