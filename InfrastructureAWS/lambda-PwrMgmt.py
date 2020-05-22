import boto3
region = 'ap-southeast-2'
ec2 = boto3.client('ec2', region_name='ap-southeast-2')
custom_filter = [
    {
        'Name':'tag:PowerManagement', 
        'Values': ['RMIT']
    }
]

def lambda_handler(event, context):
    ids = []
    response = ec2.describe_instances(Filters=custom_filter)
    for instance in response['Reservations']:
        ids.append(instance['Instances'][0]['InstanceId'])
        ec2.stop_instances(InstanceIds=ids)
        # ec2.start_instances(InstanceIds=ids)
