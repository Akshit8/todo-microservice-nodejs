## Kops

### Setup env for Kops CLI

```bash
export AWS_ACCESS_KEY_ID=<data>
export AWS_SECRET_ACCESS_KEY=<data>
export KOPS_STATE_STORE=s3://todo-k8s-cluster-state # s3 bucket for state mgmt
```

```bash
kops create cluster --name todo-app.k8s.local --zones=ap-south-1
```
