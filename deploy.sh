#!/bin/bash

echo "=== Building Docker image ==="
docker build -t korea/vehicule-inspect-api ./

echo "=== Logging into ECR ==="
aws ecr get-login-password --region us-east-2 --profile korea | docker login --username AWS --password-stdin 178659808868.dkr.ecr.us-east-2.amazonaws.com/korea/vehicule-inspect-api

echo "=== Tagging image ==="
docker tag korea/vehicule-inspect-api 178659808868.dkr.ecr.us-east-2.amazonaws.com/korea/vehicule-inspect-api

echo "=== Pushing to ECR ==="
docker push 178659808868.dkr.ecr.us-east-2.amazonaws.com/korea/vehicule-inspect-api

echo "=== Deploying to ECS ==="
aws ecs update-service --cluster Lumit --service sv-lumit-transport-api --force-new-deployment --region us-east-2 --profile korea

echo "=== Deploy complete! ==="
