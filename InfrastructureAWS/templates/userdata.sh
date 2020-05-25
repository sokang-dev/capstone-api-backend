#! /bin/bash -xe
yum update -y
yum install vim git nginx mariadb-server -y
# Get credentials for git/services/communication
aws ssm get-parameters --name {paramName} --with-decryption --query Parameters[].Value --output text > {PATH}
# Set up db user password
mysql_secure_installation <<EOF

TODO: inputs
EOF
# Create table
mysql -uroot -p -e{table}