import { app, HttpResponseInit, InvocationContext, output, HttpRequest } from "@azure/functions"

const blobOutput = output.storageBlob({
    path: 'samples-workitems/{queueTrigger}-Copy',
    connection: 'MyStorageConnectionAppSetting',
});

const queueOutput = output.storageQueue({
    queueName: 'photoqueue',
    connection: 'MyStorageConnectionAppSetting',
});

export async function UploadFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    context.log(`Uploaded Queue: ${request}`);
    const body = await request.text();
    context.extraOutputs.set(queueOutput, request.query.get('filename'));

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('UploadFile', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput],
    return: blobOutput,
    handler: UploadFile
});
