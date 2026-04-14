# Kops AWS Cluster Guide

## Prerequisites

### SSH into EC2 Instance

```bash
chmod 400 ~/Downloads/8s/k8s-bootstrap.pem
ssh -i ~/Downloads/8s/k8s-bootstrap.pem ec2-user@<EC2_PUBLIC_IP>
```

### Install kops

```bash
wget -O kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
chmod +x kops
sudo mv kops /usr/local/bin/kops
```

### Install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
```

### Configure AWS Credentials

```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (eu-west-1), Output (json)
```

### IAM Setup for kops

```bash
aws iam create-group --group-name kops

aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonRoute53FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/IAMFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonVPCFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonSQSFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess --group-name kops

aws iam create-user --user-name kops
aws iam add-user-to-group --user-name kops --group-name kops
aws iam create-access-key --user-name kops
```

### Export kops Credentials

```bash
export AWS_ACCESS_KEY_ID=<kops_access_key>
export AWS_SECRET_ACCESS_KEY=<kops_secret_key>

# Persist across sessions
echo 'export AWS_ACCESS_KEY_ID=<kops_access_key>' >> ~/.bashrc
echo 'export AWS_SECRET_ACCESS_KEY=<kops_secret_key>' >> ~/.bashrc
source ~/.bashrc
```

## Environment Variables

```bash
export NAME=fleetman.k8s.local
export KOPS_STATE_STORE=s3://amir-bootstrap-k8s-1990

# Persist across sessions
echo 'export NAME=fleetman.k8s.local' >> ~/.bashrc
echo 'export KOPS_STATE_STORE=s3://amir-bootstrap-k8s-1990' >> ~/.bashrc
source ~/.bashrc
```

## Create Cluster

```bash
kops create cluster \
  --name ${NAME} \
  --zones eu-west-1a,eu-west-1b,eu-west-1c \
  --node-count 3 \
  --node-size t3.medium \
  --control-plane-size t3.medium \
  --state ${KOPS_STATE_STORE}

kops update cluster --name ${NAME} --yes --admin
kops validate cluster --wait 10m
```

## Useful Commands

```bash
# Check cluster status
kops validate cluster

# List nodes
kubectl get nodes -o wide

# List instance groups
kops get ig --name ${NAME}

# Edit instance group (worker nodes)
kops edit ig nodes-eu-west-1a --name ${NAME}

# Edit cluster config
kops edit cluster --name ${NAME}

# Apply changes after editing
kops update cluster --name ${NAME} --yes
kops rolling-update cluster --name ${NAME} --yes
```

## Delete Cluster

```bash
kops delete cluster --name ${NAME} --yes
```

This removes all AWS resources (EC2, VPC, subnets, security groups, load balancers).
The S3 state store bucket is preserved for future use.
