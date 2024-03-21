import { app, HttpResponseInit, InvocationContext, output, HttpRequest } from "@azure/functions"

const queueOutput = output.storageQueue({
    queueName: 'assign2api1queue',
    connection: 'MyStorageConnectionAppSetting',
});

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request.');

    context.log(`The value of the secret is: ${process.env.KVsecret2}`);
    const body = await request.text();
    context.log(body);
    context.extraOutputs.set(queueOutput, body);

    // Get the current date
    const today = new Date();

    // Format today's date as a string (e.g., '2024-02-16')
    const dateString = today.toISOString().split('T')[0];

    const name = request.query.get('name') || body;
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