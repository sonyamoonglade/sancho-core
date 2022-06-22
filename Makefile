

run-local-server:
	npm run start:dev
run-local-frontend:
	cd src/client && npm start
changes-frontend:
	cd src/client && tar cf - --exclude=node_modules --exclude=.env . | (cd ../../../deploy-client && tar xvf -) && cd ../../../deploy-client && git add . && git commit -m "deploy" && git push heroku master



