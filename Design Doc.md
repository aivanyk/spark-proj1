![](./docs/assign4.png)

### Components:

**GitHub Workflows**: The workflow triggers actions like testing, building, and deploying applications based on code changes. The N/S arrow indicates that the workflows interactes with developers pushing code.

**Container Registry**: It stores container images that have been created by the build process. These images are ready to be pulled and deployed as containerized applications.

**Container App**: Represents the deployed instances of the application running in containers. API2 in our case.

**Web App**: The front-end component that users interact with. The N/S arrow here suggests that the Web App communicates with users across the external network.

**Function App**: A serverless compute service that runs backend code in response to triggers such as HTTP requests, database changes, or queue messages. It interacts with both the Container App and the Web App. API1 in our case.

**Users**: The end-users who interact with the Web App over the North-South boundary, typically through the internet.

**Resource Group**: A logical container in cloud platforms used to group together related resources for an application.

**KeyVault**: The KeyVault stores the secrets to be shown and access key to the storage queue. All the applications gain access to the KeyVault using system identity and role assignments.

**Storage Queue**: A storage queue that accepts function app inputs and triggers the container app.

E/W Networking Boundaries: All the arrows marked as "East-West" meaning that it is communication between services within the same network, not leaving to the external internet.

### Data Flow:

1. **Code Push & CI/CD Trigger**: Developers push updates to GitHub, initiating the GitHub Workflows.

2. **Build & Image Push**: A Docker image is created and pushed to the Container Registry.

3. **Deployment**: The image is deployed to the Container App, and the Function App is set up to handle backend tasks.

4. **User Interaction**: Users interact with the Web App, which uses the other apps to serve content and perform actions.

5. **Resource Management**: All services are contained within an Azure Resource Group for easy management.

## Getting Started

To begin working with the application:

1. **Permissions**: Ensure access to the GitHub repository, Container Registry, and Azure Resource Group.

2. **Local Development**: Clone the repository and set up your local environment as per the project's guidelines.

3. **Deployment**: Refer to the GitHub Workflows for instructions on the CI/CD processes.

4. **Monitoring & Maintenance**: Post-deployment, use Azure's monitoring services to keep track of application performance and health, updating code and dependencies when necessary.

