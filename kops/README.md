## Kops

### Setup env for Kops CLI

```bash
source ./kops.sh
```

```bash
kops create cluster --name todo-app.k8s.local \
  --zones=ap-south-1a \
  --node-count=2 \
  --master-size="t2.micro" \
  --node-size="t2.micro" \
  --dry-run \
  -o yaml > cluster.yaml
```
