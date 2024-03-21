import { app, HttpResponseInit, InvocationContext, output, HttpRequest } from "@azure/functions"
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const queueOutput = output.storageQueue({
    queueName: 'assign2api1queue',
    connection: 'MyStorageConnectionAppSetting',
});

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = await request.text();
    context.extraOutputs.set(queueOutput, body);
    return { body: 'Created queue item.' };
}

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    const keyVaultName = "assign4KV";
    const keyVaultUrl = `https://${keyVaultName}.vault.azure.net/`;
    const secretName = "secret2";

    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUrl, credential);

    let secretValue = "";
    try {
        // Retrieve the secret value from Azure Key Vault
        const secretBundle = await secretClient.getSecret(secretName);
        secretValue = secretBundle.value;
        context.log(`The value of the secret is: ${secretValue}`);
    } catch (error) {
        context.error(`Failed to retrieve the secret from Azure Key Vault: ${error}`);
        secretValue = "Error retrieving the secret.";
    }

    const body = await request.text();
    context.extraOutputs.set(queueOutput, body);

    // Get the current date
    const today = new Date();

    // Format today's date as a string (e.g., '2024-02-16')
    const dateString = today.toISOString().split('T')[0];

    const name = request.query.get('name') || (await request.text());
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "Today's date is " + dateString; 

    return {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

// export default httpTrigger;
app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput],
    handler: httpTrigger,
});