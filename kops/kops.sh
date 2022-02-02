#! /bin/bash

data=$(cat ../.aws/credentials | grep aws_access_key_id)
export AWS_ACCESS_KEY_ID=(${data//"aws_access_key_id = "/})

data=$(cat ../.aws/credentials | grep aws_secret_access_key)
export AWS_SECRET_ACCESS_KEY=(${data//"aws_secret_access_key = "/})

export KOPS_STATE_STORE=s3://todo-k8s-cluster-state