runs:
	npm run start:dev
  
runf:
	cd src/client && npm start

build-prod:
	docker build -f ./docker/prod.Dockerfile -t sonyamoonglade/sancho-hub:backend-core-prod . && docker push sonyamoonglade/sancho-hub:backend-core-prod

cp-prod:
	cp .env.prod ../deployment/backend/.env.prod && cp migrations -r ../deployment/backend/






















