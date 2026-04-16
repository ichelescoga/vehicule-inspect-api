#!/bin/bash

ECR_REPOSITORY="178659808868.dkr.ecr.us-east-2.amazonaws.com/korea/vehicule-inspect-api"
ECS_CLUSTER="korea"
ECS_SERVICE="sv-vehicle-inspect"
AWS_REGION="us-east-2"
AWS_PROFILE="korea"

echo "=== Building Docker image ==="
docker build --platform linux/amd64 -t korea/vehicule-inspect-api ./

echo "=== Logging into ECR ==="
aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | docker login --username AWS --password-stdin $ECR_REPOSITORY

echo "=== Tagging image ==="
docker tag korea/vehicule-inspect-api $ECR_REPOSITORY

echo "=== Pushing to ECR ==="
docker push $ECR_REPOSITORY

echo "=== Deploying to ECS ==="
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION --profile $AWS_PROFILE

echo "=== Deploy complete! ==="
