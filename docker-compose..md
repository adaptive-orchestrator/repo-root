# Docker Compose
build and run all container for system retail
```bash
docker compose -f docker-compose-retail.yaml up --build
```
Check state
```bash
docker ps -a
```
Delete all container
```bash
docker compose -f docker-compose-retail.yaml down 
```
