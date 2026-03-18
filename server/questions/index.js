const questions = [
  {
    id: 1,
    question: "In Docker, what is the main purpose of a multi-stage build?",
    options: [
      "To run multiple containers in one image",
      "To reduce final image size by separating build and runtime stages",
      "To add multiple CMD instructions in one Dockerfile",
      "To run containers on multiple hosts automatically",
    ],
    answer: 1,
  },
  {
    id: 2,
    question: "Which Kubernetes object ensures a specified number of Pod replicas are running?",
    options: ["Service", "ConfigMap", "Deployment", "Ingress"],
    answer: 2,
  },
  {
    id: 3,
    question: "Which AWS service is commonly used to store Docker container images?",
    options: ["Amazon RDS", "Amazon ECR", "Amazon SQS", "Amazon CloudFront"],
    answer: 1,
  },
  {
    id: 4,
    question: "What does the Linux command chmod +x script.sh do?",
    options: [
      "Compresses script.sh",
      "Changes owner of script.sh",
      "Adds execute permission to script.sh",
      "Deletes script.sh after execution",
    ],
    answer: 2,
  },
  {
    id: 5,
    question: "In CI/CD, what is the primary goal of Continuous Integration?",
    options: [
      "Manual deployment to production",
      "Frequent code merges with automated build/test",
      "Running only security scans every month",
      "Replacing version control systems",
    ],
    answer: 1,
  },
  {
    id: 6,
    question: "Which Kubernetes command is used to view Pod logs?",
    options: ["kubectl inspect pod-name", "kubectl logs pod-name", "kubectl read pod-name", "kubectl debug pod-name --log"],
    answer: 1,
  },
  {
    id: 7,
    question: "What is the default behavior of docker run -d?",
    options: [
      "Runs a container in detached/background mode",
      "Deletes container after it exits",
      "Runs a container with debug logging only",
      "Downloads image dependencies only",
    ],
    answer: 0,
  },
  {
    id: 8,
    question: "Which AWS service helps define infrastructure as code using templates?",
    options: ["AWS Lambda", "AWS CloudWatch", "AWS CloudFormation", "AWS IAM"],
    answer: 2,
  },
  {
    id: 9,
    question: "What does a non-zero exit code usually indicate in Linux shell scripting?",
    options: ["Successful execution", "No output", "An error or failure condition", "Script is running in background"],
    answer: 2,
  },
  {
    id: 10,
    question: "In a Jenkins pipeline, why are stages useful?",
    options: [
      "They store credentials securely",
      "They split the workflow into logical, monitorable steps",
      "They replace source control integration",
      "They reduce CPU usage automatically",
    ],
    answer: 1,
  },
  {
    id: 11,
    question: "Which Kubernetes resource exposes an application to network traffic inside a cluster?",
    options: ["Service", "Secret", "Namespace", "ReplicaSet"],
    answer: 0,
  },
  {
    id: 12,
    question: "What is the main benefit of using an IAM role for an EC2 instance?",
    options: [
      "It enables SSH without key pairs",
      "It lets the instance access AWS services without hardcoded credentials",
      "It increases CPU performance",
      "It encrypts all EBS volumes automatically",
    ],
    answer: 1,
  },
  {
    id: 13,
    question: "Which Docker command lists running containers only?",
    options: ["docker images", "docker ps", "docker logs", "docker inspect"],
    answer: 1,
  },
  {
    id: 14,
    question: "What is the purpose of a Kubernetes ConfigMap?",
    options: [
      "To store non-sensitive configuration data for applications",
      "To autoscale Deployments based on CPU usage",
      "To expose services outside the cluster",
      "To encrypt container images before deployment",
    ],
    answer: 0,
  },
  {
    id: 15,
    question: "Which AWS service is commonly used to run virtual machines?",
    options: ["Amazon EC2", "Amazon DynamoDB", "Amazon Route 53", "Amazon SNS"],
    answer: 0,
  },
  {
    id: 16,
    question: "What does the Linux command tail -f /var/log/app.log do?",
    options: [
      "Deletes the log file after reading it",
      "Prints file permissions for the log file",
      "Continuously shows new lines appended to the log file",
      "Moves the log file to the /var/log directory",
    ],
    answer: 2,
  },
  {
    id: 17,
    question: "In GitHub Actions, what is a workflow primarily used for?",
    options: [
      "Creating Git branches automatically",
      "Defining automated jobs triggered by repository events",
      "Replacing pull requests with manual approvals",
      "Hosting container registries directly inside Git",
    ],
    answer: 1,
  },
  {
    id: 18,
    question: "Which Kubernetes command is used to apply a manifest file?",
    options: [
      "kubectl start -f deployment.yaml",
      "kubectl deploy deployment.yaml",
      "kubectl apply -f deployment.yaml",
      "kubectl create service deployment.yaml",
    ],
    answer: 2,
  },
  {
    id: 19,
    question: "What is the main purpose of a load balancer in cloud architecture?",
    options: [
      "To distribute incoming traffic across multiple targets",
      "To store backups for virtual machines",
      "To compress application binaries before deployment",
      "To replace DNS records during outages",
    ],
    answer: 0,
  },
  {
    id: 20,
    question: "Why are environment variables commonly used in deployments?",
    options: [
      "They automatically encrypt all application logs",
      "They allow configuration to be injected without changing source code",
      "They remove the need for CI/CD pipelines",
      "They guarantee containers will never restart",
    ],
    answer: 1,
  },
];

module.exports = questions;
