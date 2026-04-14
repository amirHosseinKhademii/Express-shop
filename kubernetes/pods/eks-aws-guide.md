# EKS AWS Cluster Guide

## Prerequisites

### SSH into EC2 Instance

```bash
chmod 400 ~/Downloads/8s/k8s-bootstrap.pem
ssh -i ~/Downloads/8s/k8s-bootstrap.pem ec2-user@<EC2_PUBLIC_IP>
```

### Configure AWS Credentials

```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (eu-west-1), Output (json)
```

### Export kops User Credentials (if created previously)

```bash
export AWS_ACCESS_KEY_ID=<kops_access_key>
export AWS_SECRET_ACCESS_KEY=<kops_secret_key>
```

### Install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

### Install eksctl

```bash
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH
curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"
tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz
sudo mv /tmp/eksctl /usr/local/bin/eksctl
eksctl version
```

## IAM Permissions Required

The AWS user needs these policies (already attached to `kops` group):

- `AmazonEC2FullAccess`
- `AmazonRoute53FullAccess`
- `AmazonS3FullAccess`
- `IAMFullAccess`
- `AmazonVPCFullAccess`
- `AmazonSQSFullAccess`
- `AmazonEventBridgeFullAccess`

EKS additionally requires `AmazonEKSClusterPolicy` — eksctl creates the needed roles automatically.

## Create Cluster

```bash
eksctl create cluster \
  --name fleetman \
  --region eu-west-1 \
  --zones eu-west-1a,eu-west-1b,eu-west-1c \
  --nodegroup-name workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4
```

Takes 15-20 minutes. Creates:
- EKS control plane (fully managed by AWS)
- 3 worker nodes across 3 availability zones
- VPC, subnets, security groups, IAM roles

## Useful Commands

```bash
# Check nodes
kubectl get nodes -o wide

# List clusters
eksctl get cluster --region eu-west-1

# List nodegroups
eksctl get nodegroup --cluster fleetman --region eu-west-1

# Scale nodegroup
eksctl scale nodegroup --cluster fleetman --name workers --nodes 5 --region eu-west-1

# Update kubeconfig (if context lost)
aws eks update-kubeconfig --name fleetman --region eu-west-1

# Get cluster info
kubectl cluster-info
```

## Delete Cluster

```bash
eksctl delete cluster --name fleetman --region eu-west-1
```

This removes all AWS resources: EKS control plane, worker EC2 instances,
VPC, subnets, NAT gateways, security groups, IAM roles, and CloudFormation stacks.

## EKS vs kops

| Feature | EKS (eksctl) | kops |
|---------|-------------|------|
| Control plane | Managed by AWS | Self-managed on EC2 |
| Setup time | 15-20 min | 5-10 min |
| Cost | $0.10/hr for control plane + nodes | Nodes only |
| Upgrades | AWS handles control plane | Manual |
| Multi-AZ | Built-in | Manual config |
