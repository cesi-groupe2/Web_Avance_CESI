**CI/CD**
Dans le dossier .github/workflow, un fichier yml nous permet de tester notre code. La première étape est un linter qui analyse la qualité de code en Go. 
Dans un second temps, une analyse de complexité permettra de maintenir un code propre et compréhensible pour une meilleure évoluabilité de notre application.
Dans un troisième temps, une analyse de sécurité de notre application sera lancée.

## Launch API Gateway
### Create Docker network
```bash
docker network create easeat-net
```

Si BDD (docker) mysql n'est pas sur le network easeat-net, il faut executer la commande suivante:
```bash
docker network connect easeat-net mysql
docker network connect easeat-net mongodbmain-db-client-1
```

### Launch API Gateway
To launch the API Gateway, you need to create file .env in the 'backend' folder.  
.env example:
```txt
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=8000
MONGO_HOST=localhost
MONGO_PORT=27017
MYSQL_ADDRESS=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=easeat
...
```

Now you can start the API Gateway, with all microservices:
On backend file
```bash
docker-compose up --build
```

### To stop the API Gateway
```bash
docker-compose down -v
```
