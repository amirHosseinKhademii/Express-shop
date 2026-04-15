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

## Install EBS CSI Driver (required for persistent volumes)

```bash
# 1. Install the Pod Identity agent addon
eksctl create addon --cluster fleetman --name eks-pod-identity-agent --region eu-west-1

# 2. Install the EBS CSI driver
eksctl create addon --name aws-ebs-csi-driver --cluster fleetman --region eu-west-1

# 3. Grant IAM permissions to the CSI controller
eksctl create podidentityassociation \
  --cluster fleetman \
  --region eu-west-1 \
  --namespace kube-system \
  --service-account-name ebs-csi-controller-sa \
  --permission-policy-arns arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy

# 4. Restart the controller to pick up credentials
kubectl rollout restart deployment ebs-csi-controller -n kube-system

# 5. Verify all pods are running
kubectl get pods -n kube-system | grep -E "ebs|pod-identity"
```

## Deploy Workloads

### Copy files to EC2 (use heredoc)

```bash
cat > ~/mongo-dep.yaml << 'EOF'
# paste mongo-dep.yaml contents
EOF

cat > ~/workloads.yaml << 'EOF'
# paste workloads.yaml contents
EOF

cat > ~/services.yaml << 'EOF'
# paste services.yaml contents
EOF
```

### Apply in order

```bash
kubectl apply -f ~/mongo-dep.yaml
kubectl apply -f ~/workloads.yaml
kubectl apply -f ~/services.yaml
```

### Verify

```bash
kubectl get pods
kubectl get svc
kubectl get pvc
```

## Troubleshooting

### MongoDB compatibility

- Use `mongo:4.4` — the fleetman apps use `mongodb-driver-core-3.2.2` which relies on legacy opcodes removed in MongoDB 6.0+
- Do not set `MONGO_INITDB_ROOT_USERNAME`/`MONGO_INITDB_ROOT_PASSWORD` — fleetman apps connect without auth
- If MongoDB crashes with exit code 14 after a version downgrade, delete the PVC and reapply to start with fresh data files

### EBS CSI controller CrashLoopBackOff

The controller needs IAM permissions. Ensure the Pod Identity agent is installed and the `AmazonEBSCSIDriverPolicy` is associated (see install steps above).

### PVC stuck in Pending

- If using `WaitForFirstConsumer`, the PVC stays Pending until a Pod using it gets scheduled — this is expected
- If the Pod is also Pending, check the EBS CSI driver is installed and healthy: `kubectl get pods -n kube-system | grep ebs`

### LoadBalancer service not accessible in browser

- Ensure you use `http://` not `https://` (no TLS configured)
- ELB DNS propagation takes 2-3 minutes after creation
- Try an incognito window (browser may force HTTPS via HSTS)
- Verify from EC2: `curl -v http://<ELB_DNS>`

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

# Get LoadBalancer DNS
kubectl get svc fleetman-webapp

# Check pod logs
kubectl logs <pod-name>

# Describe a pod (for debugging)
kubectl describe pod <pod-name>
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
