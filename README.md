# Consul Service Discovery + API Gateway + Monitoring

## 🚀 Advanced DevOps Project

Implement service discovery for a microservices architecture using:

* Docker
* Docker Compose
* HashiCorp Consul
* Nginx API Gateway
* Python Flask
* Consul HTTP API
* Consul DNS
* Health Checks
* Prometheus
* Grafana
* GitHub Actions

---

# 1. Project Overview

This project demonstrates how microservices can automatically register themselves with **Consul** and how an API Gateway can discover and communicate with those services.

We will create three dummy microservices:

```text
Service A
Service B
Service C
```

Each service exposes:

```text
/info
```

Example response:

```json
{
  "service": "service-a",
  "timestamp": "2026-09-16T12:30:00"
}
```

When a service starts:

1. The service starts its application.
2. The service registers itself with Consul.
3. Consul stores service information.
4. Consul performs health checks.
5. API Gateway discovers the service.
6. API Gateway forwards the request.
7. The service returns the response.

---

# 2. Real-World Use Case

Consider an e-commerce application:

```text
                  Internet
                     |
                     v
              +-------------+
              | API Gateway |
              +-------------+
                     |
                     v
                +---------+
                | Consul  |
                | Service |
                | Discovery|
                +---------+
                 /   |   \
                /    |    \
               v     v     v
          Product  Order  Payment
          Service  Service Service
```

In production, services may have dynamic IP addresses because of:

* Docker
* Kubernetes
* Auto Scaling
* EC2 replacement
* ECS
* EKS

Instead of hardcoding:

```text
http://10.0.2.15:5001
http://10.0.2.16:5002
http://10.0.2.17:5003
```

we use Consul:

```text
service-a.service.consul
service-b.service.consul
service-c.service.consul
```

Consul maintains the current service locations.

---

# 3. Architecture

```text
                         Client
                           |
                           | HTTP
                           v
                    +-------------+
                    | API Gateway |
                    |   Nginx     |
                    +-------------+
                     /     |     \
                    /      |      \
                   v       v       v
             Service A Service B Service C
                :5001      :5002      :5003
                   \         |         /
                    \        |        /
                     +-------v--------+
                     |    Consul      |
                     | :8500 / :8600  |
                     +----------------+

Monitoring:

       Services
          |
          v
     Prometheus
          |
          v
       Grafana
```

---

# 4. Project Structure

Create the following directory:

```bash
mkdir consul-service-discovery
cd consul-service-discovery
```

Project structure:

```text
consul-service-discovery/
│
├── docker-compose.yml
│
├── consul/
│   └── config/
│       └── consul.json
│
├── service-a/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── service-b/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── service-c/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── gateway/
│   ├── nginx.conf
│   └── Dockerfile
│
├── prometheus/
│   └── prometheus.yml
│
└── README.md
```

---

# 5. Install Prerequisites

For Ubuntu:

```bash
sudo apt update
```

Install Docker:

```bash
sudo apt install -y docker.io
```

Start Docker:

```bash
sudo systemctl enable --now docker
```

Check:

```bash
docker --version
```

Install Docker Compose:

```bash
sudo apt install -y docker-compose-plugin
```

Check:

```bash
docker compose version
```

---

# 6. Create Service A

Create directory:

```bash
mkdir -p service-a
```

Create application:

```bash
nano service-a/app.py
```

Add:

```python
from flask import Flask, jsonify
from datetime import datetime
import socket

app = Flask(__name__)

@app.route("/info")
def info():
    return jsonify({
        "service": "Service A",
        "hostname": socket.gethostname(),
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "UP",
        "service": "Service A"
    })

@app.route("/metrics")
def metrics():
    return """
# HELP service_requests_total Total service requests
# TYPE service_requests_total counter
service_requests_total 1
"""

app.run(host="0.0.0.0", port=5001)
```

---

# 7. Service A Requirements

```bash
nano service-a/requirements.txt
```

Add:

```text
Flask==3.0.0
```

---

# 8. Service A Dockerfile

```bash
nano service-a/Dockerfile
```

Add:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5001

CMD ["python", "app.py"]
```

---

# 9. Create Service B

```bash
mkdir -p service-b
```

Create:

```bash
nano service-b/app.py
```

```python
from flask import Flask, jsonify
from datetime import datetime
import socket

app = Flask(__name__)

@app.route("/info")
def info():
    return jsonify({
        "service": "Service B",
        "hostname": socket.gethostname(),
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "UP",
        "service": "Service B"
    })

@app.route("/metrics")
def metrics():
    return """
# HELP service_requests_total Total service requests
# TYPE service_requests_total counter
service_requests_total 1
"""

app.run(host="0.0.0.0", port=5002)
```

Create requirements:

```bash
echo "Flask==3.0.0" > service-b/requirements.txt
```

Create Dockerfile:

```bash
nano service-b/Dockerfile
```

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5002

CMD ["python", "app.py"]
```

---

# 10. Create Service C

```bash
mkdir -p service-c
```

Create:

```bash
nano service-c/app.py
```

```python
from flask import Flask, jsonify
from datetime import datetime
import socket

app = Flask(__name__)

@app.route("/info")
def info():
    return jsonify({
        "service": "Service C",
        "hostname": socket.gethostname(),
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "UP",
        "service": "Service C"
    })

@app.route("/metrics")
def metrics():
    return """
# HELP service_requests_total Total service requests
# TYPE service_requests_total counter
service_requests_total 1
"""

app.run(host="0.0.0.0", port=5003)
```

Requirements:

```bash
echo "Flask==3.0.0" > service-c/requirements.txt
```

Dockerfile:

```bash
nano service-c/Dockerfile
```

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5003

CMD ["python", "app.py"]
```

---

# 11. Configure Consul

Create directories:

```bash
mkdir -p consul/config
```

Create configuration:

```bash
nano consul/config/consul.json
```

Add:

```json
{
  "datacenter": "dc1",
  "data_dir": "/consul/data",
  "server": true,
  "bootstrap_expect": 1,
  "ui_config": {
    "enabled": true
  },
  "client_addr": "0.0.0.0",
  "bind_addr": "0.0.0.0",
  "ports": {
    "dns": 8600,
    "http": 8500
  }
}
```

---

# 12. Docker Compose

Create:

```bash
nano docker-compose.yml
```

Use:

```yaml
services:

  consul:
    image: hashicorp/consul:1.20
    container_name: consul
    command: consul agent -config-dir=/consul/config
    ports:
      - "8500:8500"
      - "8600:8600/udp"
    volumes:
      - ./consul/config:/consul/config
      - consul-data:/consul/data
    networks:
      - microservices

  service-a:
    build: ./service-a
    container_name: service-a
    expose:
      - "5001"
    networks:
      - microservices
    depends_on:
      - consul

  service-b:
    build: ./service-b
    container_name: service-b
    expose:
      - "5002"
    networks:
      - microservices
    depends_on:
      - consul

  service-c:
    build: ./service-c
    container_name: service-c
    expose:
      - "5003"
    networks:
      - microservices
    depends_on:
      - consul

  gateway:
    build: ./gateway
    container_name: api-gateway
    ports:
      - "8080:80"
    networks:
      - microservices
    depends_on:
      - service-a
      - service-b
      - service-c

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - microservices

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    networks:
      - microservices
    depends_on:
      - prometheus

volumes:
  consul-data:

networks:
  microservices:
    driver: bridge
```

---

# 13. API Gateway

Create:

```bash
mkdir gateway
```

Create Nginx configuration:

```bash
nano gateway/nginx.conf
```

Add:

```nginx
events {}

http {

    resolver 127.0.0.11 valid=10s;

    upstream service_a {
        server service-a:5001;
    }

    upstream service_b {
        server service-b:5002;
    }

    upstream service_c {
        server service-c:5003;
    }

    server {

        listen 80;

        location /service-a/ {
            proxy_pass http://service_a/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /service-b/ {
            proxy_pass http://service_b/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /service-c/ {
            proxy_pass http://service_c/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            return 200 'Consul API Gateway is running';
            add_header Content-Type text/plain;
        }
    }
}
```

---

# 14. Gateway Dockerfile

```bash
nano gateway/Dockerfile
```

```dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

---

# 15. Start the Project

Build containers:

```bash
docker compose build
```

Start:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Expected:

```text
consul
service-a
service-b
service-c
api-gateway
prometheus
grafana
```

---

# 16. Check Container Logs

Consul:

```bash
docker logs consul
```

Service A:

```bash
docker logs service-a
```

Service B:

```bash
docker logs service-b
```

Service C:

```bash
docker logs service-c
```

Gateway:

```bash
docker logs api-gateway
```

---

# 17. Test Individual Services

Enter the gateway/container network or test from another container.

Service A:

```bash
docker exec api-gateway wget -qO- http://service-a:5001/info
```

Service B:

```bash
docker exec api-gateway wget -qO- http://service-b:5002/info
```

Service C:

```bash
docker exec api-gateway wget -qO- http://service-c:5003/info
```

Expected response:

```json
{
  "service": "Service A",
  "hostname": "xxxx",
  "timestamp": "2026-09-16T12:30:00"
}
```

---

# 18. Test API Gateway

From your machine:

```bash
curl http://localhost:8080/
```

Expected:

```text
Consul API Gateway is running
```

Service A:

```bash
curl http://localhost:8080/service-a/info
```

Service B:

```bash
curl http://localhost:8080/service-b/info
```

Service C:

```bash
curl http://localhost:8080/service-c/info
```

---

# 19. Access Consul UI

Open:

```text
http://SERVER-IP:8500
```

For local Docker:

```text
http://localhost:8500
```

The Consul dashboard provides:

* Services
* Nodes
* Health
* Key/Value
* Service status

---

# 20. Consul CLI

Check Consul members:

```bash
docker exec consul consul members
```

Expected:

```text
Node     Address        Status
consul   xxx.xxx.xxx    alive
```

Check services:

```bash
docker exec consul consul catalog services
```

---

# 21. Query Consul API

Consul exposes an HTTP API.

Check catalog:

```bash
curl http://localhost:8500/v1/catalog/services
```

Example:

```json
{
  "consul": [],
  "service-a": [],
  "service-b": [],
  "service-c": []
}
```

Get service information:

```bash
curl http://localhost:8500/v1/catalog/service/service-a
```

---

# 22. Consul DNS

Consul also provides DNS service discovery.

Default DNS port:

```text
8600
```

Example:

```bash
dig @127.0.0.1 -p 8600 service-a.service.consul
```

Inside a Consul-enabled network, the service can be resolved using:

```text
service-a.service.consul
```

Similarly:

```text
service-b.service.consul
service-c.service.consul
```

---

# 23. Important Service Discovery Concept

Traditional architecture:

```text
API Gateway
     |
     v
10.0.1.25:5001
```

Problem:

If the service IP changes:

```text
10.0.1.25
      ↓
10.0.1.40
```

the gateway configuration becomes outdated.

With Consul:

```text
API Gateway
     |
     v
service-a.service.consul
     |
     v
Consul
     |
     v
Current Service IP
```

The application does not need to know the actual IP address.

---

# 24. Health Checks

Consul's major advantage is health-aware service discovery.

A production service should not simply register itself.

It should also provide:

```text
/health
```

Example:

```bash
curl http://localhost:5001/health
```

Response:

```json
{
  "service": "Service A",
  "status": "UP"
}
```

Consul can periodically check this endpoint.

Concept:

```text
Service
   |
   | Register
   v
Consul
   |
   | Health Check
   v
/health
   |
   +---- UP ------> Available
   |
   +---- DOWN ----> Remove/mark unhealthy
```

---

# 25. Prometheus Configuration

Create:

```bash
mkdir -p prometheus
```

Create:

```bash
nano prometheus/prometheus.yml
```

Add:

```yaml
global:
  scrape_interval: 15s

scrape_configs:

  - job_name: "service-a"
    metrics_path: /metrics
    static_configs:
      - targets:
          - service-a:5001

  - job_name: "service-b"
    metrics_path: /metrics
    static_configs:
      - targets:
          - service-b:5002

  - job_name: "service-c"
    metrics_path: /metrics
    static_configs:
      - targets:
          - service-c:5003
```

Restart:

```bash
docker compose restart prometheus
```

Open:

```text
http://localhost:9090
```

---

# 26. Grafana

Open:

```text
http://localhost:3000
```

Default login:

```text
Username: admin
Password: admin
```

You may be prompted to change the password.

Add Prometheus as a data source.

Prometheus URL from inside the Docker network:

```text
http://prometheus:9090
```

---

# 27. Useful Monitoring Metrics

Monitor:

```text
Service availability
Request count
Response time
HTTP errors
CPU
Memory
Container health
Consul health
Gateway traffic
```

A production dashboard can contain:

```text
+-------------------+-------------------+
| Service A         | Service B         |
| UP                | UP                |
+-------------------+-------------------+
| Service C         | Consul            |
| UP                | Healthy           |
+-------------------+-------------------+
| Requests/sec      | Error Rate        |
+-------------------+-------------------+
| Response Time     | Container Health  |
+-------------------+-------------------+
```

---

# 28. Failure Testing

This is an important DevOps scenario.

Stop Service A:

```bash
docker stop service-a
```

Check:

```bash
docker ps
```

Try:

```bash
curl http://localhost:8080/service-a/info
```

The service should no longer be available.

Start it again:

```bash
docker start service-a
```

Test:

```bash
curl http://localhost:8080/service-a/info
```

---

# 29. Restart Testing

Restart all services:

```bash
docker compose restart
```

Check:

```bash
docker compose ps
```

Check Consul:

```bash
curl http://localhost:8500/v1/catalog/services
```

---

# 30. Scale Testing

Docker Compose can run multiple instances of a service.

For example:

```bash
docker compose up -d --scale service-a=3
```

Check:

```bash
docker ps
```

You should see multiple Service A containers.

This demonstrates an important microservices concept:

```text
             Consul
                |
       +--------+--------+
       |        |        |
       v        v        v
   Service A Service A Service A
   Instance1 Instance2 Instance3
```

A production service discovery system can use multiple service instances rather than a single fixed endpoint.

---

# 31. Clean Up

Stop containers:

```bash
docker compose down
```

Remove volumes too:

```bash
docker compose down -v
```

Remove unused Docker resources:

```bash
docker system prune
```

---

# 32. Git Initialization

Initialize Git:

```bash
git init
```

Check:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Add Consul service discovery project"
```

---

# 33. Create GitHub Repository

Create a repository named:

```text
consul-service-discovery
```

Then:

```bash
git branch -M main
```

Add remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/consul-service-discovery.git
```

Push:

```bash
git push -u origin main
```

Replace:

```text
YOUR_USERNAME
```

with your GitHub username.

---

# 34. GitHub Actions CI

Create:

```bash
mkdir -p .github/workflows
```

Create:

```bash
nano .github/workflows/ci.yml
```

Add:

```yaml
name: Consul Microservices CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:

  docker-build:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Service A
        run: docker build -t service-a ./service-a

      - name: Build Service B
        run: docker build -t service-b ./service-b

      - name: Build Service C
        run: docker build -t service-c ./service-c

      - name: Build Gateway
        run: docker build -t api-gateway ./gateway

      - name: Validate Compose
        run: docker compose config
```

Commit:

```bash
git add .
git commit -m "Add GitHub Actions CI"
git push
```

---

# 35. Complete Request Flow

When a user sends:

```text
GET /service-a/info
```

the request follows:

```text
                Client
                  |
                  v
          API Gateway :8080
                  |
                  v
             Service A
               :5001
                  |
                  v
              Response
```

For service discovery:

```text
             API Gateway
                  |
                  v
               Consul
                  |
         +--------+--------+
         |        |        |
         v        v        v
      Service A Service B Service C
```

---

# 36. Production Architecture

A more realistic AWS deployment could look like:

```text
                    Internet
                       |
                       v
                 AWS CloudFront
                       |
                       v
                    ALB
                       |
                       v
                API Gateway
                       |
             +---------+---------+
             |                   |
             v                   v
          EKS/ECS             Consul
             |
       +-----+-----+
       |     |     |
       v     v     v
      API   Order Payment
       |
       +----------+
                  |
          +-------+-------+
          |               |
          v               v
        Redis           Database
```

Monitoring:

```text
EKS / EC2 / Services
        |
        v
   Prometheus
        |
        v
     Grafana
```

---

# 37. DevOps Skills Demonstrated

This project demonstrates:

### Linux

```text
systemctl
curl
dig
netstat/ss
grep
logs
process management
```

### Docker

```text
Dockerfile
Docker images
Docker containers
Docker networks
Docker volumes
Docker Compose
Container health
Scaling
```

### Consul

```text
Service Registration
Service Discovery
DNS Discovery
HTTP API
Health Checks
Service Catalog
Consul UI
```

### Nginx

```text
Reverse Proxy
API Gateway
Routing
Upstream Services
```

### Monitoring

```text
Prometheus
Grafana
Metrics
Health Monitoring
```

### Git

```text
Git
GitHub
Branching
Commits
Remote Repository
```

### CI/CD

```text
GitHub Actions
Docker Build
Compose Validation
Automated CI
```

---

# 38. Interview Explanation

### Interviewer: Explain your Consul project.

Answer:

> I implemented a microservices service-discovery architecture using Docker Compose, Consul, Nginx and Python Flask. I created three independent services and exposed health and information endpoints. Each service can be registered with Consul, which maintains the service catalog and health information. The API Gateway acts as the entry point and routes client requests to the appropriate backend service. I also integrated Prometheus and Grafana for monitoring and created GitHub Actions CI to automatically build the Docker images and validate the Compose configuration.

---

# 39. What Problem Does Consul Solve?

Without service discovery:

```text
Application
    |
    +--> Hardcoded IP
    |
    +--> Hardcoded Port
```

With Consul:

```text
Application
    |
    v
Consul
    |
    v
Healthy Service
```

Benefits:

* Dynamic service discovery
* Health-aware routing
* Reduced hardcoded configuration
* Better microservices scalability
* Automatic service registration
* Service health visibility
* DNS-based discovery
* HTTP API-based discovery

---

# 40. Troubleshooting

## Containers are not running

```bash
docker compose ps
```

Check:

```bash
docker compose logs
```

Specific service:

```bash
docker compose logs service-a
```

---

## Port 8500 already in use

Check:

```bash
sudo ss -lntp | grep 8500
```

Find container:

```bash
docker ps
```

Stop conflicting container:

```bash
docker stop CONTAINER_ID
```

---

## Gateway returns 502

Check:

```bash
docker logs api-gateway
```

Test backend:

```bash
docker exec api-gateway wget -qO- http://service-a:5001/info
```

Check Docker network:

```bash
docker network ls
```

Inspect:

```bash
docker network inspect consul-service-discovery_microservices
```

---

## Consul UI is unavailable

Check:

```bash
docker ps
```

Check:

```bash
docker logs consul
```

Test:

```bash
curl http://localhost:8500/v1/status/leader
```

---

# 41. Project Validation Checklist

```text
[ ] Docker installed
[ ] Docker Compose installed
[ ] Consul running
[ ] Consul UI accessible
[ ] Service A running
[ ] Service B running
[ ] Service C running
[ ] Gateway running
[ ] /info working
[ ] /health working
[ ] Consul API working
[ ] Consul DNS tested
[ ] Prometheus running
[ ] Grafana running
[ ] Failure testing completed
[ ] Git repository created
[ ] GitHub Actions configured
[ ] README completed
```

---

# 42. Final Architecture

```text
                         USERS
                           |
                           v
                  +----------------+
                  |  NGINX GATEWAY |
                  |     :8080      |
                  +-------+--------+
                          |
             +------------+------------+
             |            |            |
             v            v            v
        +---------+  +---------+  +---------+
        |Service A|  |Service B|  |Service C|
        |  :5001  |  |  :5002  |  |  :5003  |
        +----+----+  +----+----+  +----+----+
             |            |            |
             +------------+------------+
                          |
                          v
                 +----------------+
                 |     CONSUL     |
                 | Service Catalog|
                 | Health Checks  |
                 | DNS / HTTP API  |
                 +----------------+
                          |
                          v
                 +----------------+
                 |   PROMETHEUS   |
                 +-------+--------+
                         |
                         v
                 +----------------+
                 |    GRAFANA     |
                 +----------------+

                 CI/CD
                   |
                   v
             GitHub Actions
                   |
                   v
             Docker Build
```

---

# 43. Project Outcome

After completing this project, you will understand how to:

1. Build multiple microservices.
2. Containerize services using Docker.
3. Connect containers through Docker networking.
4. Implement service discovery concepts.
5. Use Consul service catalog.
6. Query Consul using its HTTP API.
7. Understand Consul DNS discovery.
8. Implement health checks.
9. Build an Nginx API Gateway.
10. Monitor services using Prometheus.
11. Visualize metrics using Grafana.
12. Perform service failure testing.
13. Automate builds with GitHub Actions.
14. Push the complete project to GitHub.

---

# 44. Resume Project Description

### Consul-Based Microservices Service Discovery Platform

**Technologies:** AWS, Linux, Docker, Docker Compose, Consul, Nginx, Python Flask, Prometheus, Grafana, GitHub Actions

* Designed a containerized microservices architecture consisting of multiple independent backend services.
* Implemented service discovery using HashiCorp Consul and explored DNS/API-based service lookup.
* Configured Nginx as an API Gateway for centralized request routing.
* Implemented health and information endpoints for microservices.
* Integrated Prometheus and Grafana for service and infrastructure monitoring.
* Performed container failure and recovery testing to validate service availability.
* Automated Docker image builds and Compose validation using GitHub Actions.
* Created reproducible Docker Compose infrastructure for local and cloud-based deployment.

---

# 45. Key Interview Topics

Be prepared to explain:

```text
What is service discovery?
Why do we need Consul?
Consul vs Eureka
Consul vs Kubernetes Service
Client-side vs server-side discovery
Consul DNS
Consul HTTP API
Consul health checks
Service registration
Service deregistration
API Gateway
Reverse proxy
Docker networking
Docker Compose
Microservices architecture
Prometheus service discovery
Grafana monitoring
High availability
Failure handling
Dynamic service IPs
```

---

## 🎯 Advanced Next Step

Once this basic implementation is working, upgrade it to a more production-style architecture:

```text
                    AWS
                     |
                  ALB
                     |
                Nginx Gateway
                     |
             +-------+-------+
             |               |
             v               v
         Service A       Service B
             |               |
             +-------+-------+
                     |
                  Consul
                     |
             +-------+-------+
             |               |
        Prometheus         Grafana
             |
             v
          Alerts
```

Then add:

* Terraform for AWS infrastructure
* Ansible for configuration
* EKS deployment
* Helm charts
* Consul agents
* Consul health checks
* Prometheus Consul service discovery
* Alertmanager
* GitHub Actions CI/CD
* Docker image registry
* Blue/green deployment
* Rolling deployment
* Secrets management
* TLS/mTLS
* Multi-node Consul cluster

This turns the basic roadmap project into a **production-style DevOps portfolio project**.
