## Action order for running this application:
* Open console
* Clone the project `git clone https://github.com/Andrew-Archer/retro-rest-service.git`
* Navigate into created app folder `cd ./retrio-rest-service`
* Run the app with following command `./mvnw clean spring-boot:run`
* To stop the app just close the console or press `ctrl+c`
* Now all api is accessible with `http://localhost:8080/api/**`
* Import postman project from root of project folder `RESTer.postman_collection.json`
* The default user on the firs start of app is `admin@admin.com` with pass `admin`
* To configure DB connection set `RETRO_DB_URL`, `RETRO_DB_USER`, `RETRO_DB_PASS` environment variables.
* To configure OAuth2 set the following environment variables:
  * For Google `GOOGLE_ID`,`GOOGLE_SECRET`
  * For Github `GITHUB_ID`,`GITHUB_SECRET`
* To update project after author's fix use git.

## Building docker image
* First you need to build the app with maven `./mvnw clean package`
* Second build the docker image `docker build --tag=retro-service-app:latest .` DO NOT FORGET "." ath the end of the command.
* Third run docker run new docker container:
```
docker run \
--env RETRO_DB_URL=jdbc:postgresql://localhost:5432/retro\
--env RETRO_DB_USER=postgres\
--env RETRO_DB_PASS=postgres\
--env GOOGLE_ID=your_id_here\
--env GOOGLE_SECRET=your_sercet_her\
--env GITHUB_ID=your_id_here\
--env GITHUB_SECRET=your_sercet_her\
-p 8080:8080\
retro-service-app:latest
