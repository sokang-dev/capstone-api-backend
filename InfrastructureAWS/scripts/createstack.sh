#! /bin/bash
postfix='-instance'
instanceName=$1$postfix
aws cloudformation create-stack --stack-name $1 --template-body file://$2 --parameters ParameterKey=appname,ParameterValue=$instanceName