#! /bin/bash
aws ec2 describe-instances --query "Reservations[].Instances[?State.Name != 'terminated'] | [].[InstanceId,PrivateIpAddress,PublicIpAddress]" --output $1