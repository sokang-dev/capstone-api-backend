#!/bin/bash
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query "StackSummeries[].StackName[]" --output table
