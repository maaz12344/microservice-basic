
# 🚀 Node.js Microservices Architecture

A microservices-based application built using **Node.js, Express.js, MongoDB, RabbitMQ, and Docker Compose**.

This project demonstrates how multiple independent services communicate with each other using asynchronous messaging through RabbitMQ.

## 🏗️ Project Architecture

The application consists of three independent microservices:

- **User Service:** Handles user-related operations.
- **Task Service:** Handles task creation and management.
- **Notification Service:** Consumes task events from RabbitMQ and processes notifications.

### Architecture Diagram

```text
                     Client
                       |
             +---------+---------+
             |                   |
        User Service        Task Service
          Port 3001           Port 3002
                                  |
                             Create Task
                                  |
                               RabbitMQ
                                  |
                            task_created
                                  |
                         Notification Service
                                  |
                               MongoDB
                              Port 27017
```

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| RabbitMQ | Message broker |
| AMQPLib | RabbitMQ client for Node.js |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |

## 📁 Project Structure

```text
microservices-personal/
│
├── user-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── index.js
│
├── task-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── index.js
│
├── notification-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── index.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## ⚙️ Services and Ports

| Service | Port | Description |
|---|---:|---|
| User Service | 3001 | User management |
| Task Service | 3002 | Task management |
| MongoDB | 27017 | Database |
| RabbitMQ | 5672 | Message broker |
| RabbitMQ Management | 15672 | Management dashboard |

## 🔄 RabbitMQ Communication Workflow

This project uses asynchronous communication between microservices through RabbitMQ.

The workflow is:

1. A client sends a request to create a task.
2. The Task Service creates the task.
3. The Task Service publishes a `task_created` event to RabbitMQ.
4. RabbitMQ places the event in the `task_created` queue.
5. The Notification Service consumes the event.
6. The Notification Service processes the message.
7. The consumer acknowledges the message using `channel.ack()`.

### Example RabbitMQ Message

```json
{
  "taskId": "123456",
  "title": "Learn Microservices",
  "description": "Understanding RabbitMQ communication",
  "userId": "987654"
}
```

### Consumer Implementation

```javascript
channel.consume('task_created', (message) => {
    if (message !== null) {
        const task = JSON.parse(message.content.toString());

        console.log('Received task:', task);

        channel.ack(message);
    }
});
```

## 🐳 Running the Project Using Docker

### Prerequisites

Make sure you have installed:

- Node.js
- Docker Desktop
- Git
- GitHub Account

### Step 1: Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### Step 2: Navigate to the Project

```bash
cd microservices-personal
```

### Step 3: Build and Start Containers

```bash
docker compose up -d --build
```

### Step 4: Check Running Containers

```bash
docker ps
```

### Step 5: View Application Logs

```bash
docker compose logs -f
```

To view logs for individual services:

```bash
docker logs user-service
docker logs task-service
docker logs notification-service
```

### Step 6: Stop All Containers

```bash
docker compose down
```

## 🐰 RabbitMQ Management Dashboard

RabbitMQ provides a management dashboard to monitor queues, messages, consumers, and message rates.

**Dashboard URL:**

[http://localhost:15672](http://localhost:15672)

Use the username and password configured in your Docker Compose file.

You can monitor:

- Queues
- Ready messages
- Unacknowledged messages
- Active consumers
- Message publishing rates
- Message delivery rates

## 🧪 Testing RabbitMQ Message Consumption

To verify RabbitMQ communication:

1. Start all Docker containers.
2. Create a task through the Task Service.
3. Open the RabbitMQ Management Dashboard.
4. Navigate to the `task_created` queue.
5. Check the Notification Service logs.
6. Verify that the message was received and acknowledged.

Run:

```bash
docker logs -f notification-service
```

### Expected Output

```text
Notification service is listening...

Received task: {
  taskId: '123456',
  title: 'Learn Microservices',
  description: 'Understanding RabbitMQ communication'
}
```

## 📚 Concepts Demonstrated

This project demonstrates the following backend and microservices concepts:

- Microservices architecture
- Independent Node.js services
- Dockerfile creation
- Docker image building
- Docker Compose orchestration
- Container networking
- MongoDB integration
- RabbitMQ message queues
- Asynchronous communication
- Producer and consumer patterns
- Message acknowledgement
- Service-to-service communication
- Error handling and connection retry mechanisms

## 🚀 Future Improvements

- [ ] Implement API Gateway.
- [ ] Add authentication and authorization using JWT.
- [ ] Implement Dead Letter Queues (DLQ).
- [ ] Add centralized logging.
- [ ] Improve message retry mechanisms.
- [ ] Add service health checks.
- [ ] Implement CI/CD using GitHub Actions.
- [ ] Deploy microservices to a cloud platform.

## 👨‍💻 Author

**Your Name**

- GitHub: (https://github.com/maaz12344)

---

⭐ If you find this project useful, feel free to star the repository!
