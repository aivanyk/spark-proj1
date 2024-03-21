import { app, HttpResponseInit, InvocationContext, output, HttpRequest } from "@azure/functions"
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const queueOutput = output.storageQueue({
    queueName: 'assign2api1queue',
    connection: 'MyStorageConnectionAppSetting',
});

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    context.log(`The value of the secret is: ${'KVsecret2'}`);
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
app.http('test1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput],
    handler: httpTrigger,
});