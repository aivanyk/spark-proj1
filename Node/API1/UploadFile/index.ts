import { app, HttpResponseInit, InvocationContext, output, trigger, HttpRequest } from "@azure/functions"
import * as multipart from 'parse-multipart';

let blobOutput = output.storageBlob({
    path: 'image/{savePath}',
    connection: 'MyStorageConnectionAppSetting',
});

const queueOutput = output.storageQueue({
    queueName: 'photoqueue',
    connection: 'MyStorageConnectionAppSetting',
});

export async function UploadFile(request, context: InvocationContext): Promise<HttpResponseInit> {
    const blobNameUrl = request.url.split('/');
    const blobName = blobNameUrl[blobNameUrl.length - 1];
    context.log(`Query: ${blobName}`);
    context.log(`Save path: ${blobOutput.path}`);

    const bodyBuffer = Buffer.from(await request.arrayBuffer());
    const boundary = multipart.getBoundary(request.headers.get('content-type'));
    const parts = multipart.Parse(bodyBuffer, boundary);
    context.extraOutputs.set(queueOutput, blobName);
    context.extraOutputs.set(blobOutput, parts[0].data);

    return {body: " "};
};

app.http('UploadFile', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput, blobOutput],
    route: 'UploadFile/{savePath}',
    // return: blobOutput,
    handler: UploadFile
});

// export default async function httpTrigger(
//     context: InvocationContext,
//     request: HttpRequest
//   ): Promise<any> {
//     const blobName = request.query.get("filename");
  
//     try {
//       // Each chunk of the file is delimited by a special string
      
  
//       // Actual upload, using an output binding
//       context.bindings.storage = parts[0]?.data;
//     } catch (err) {
//       context.log.error(err.message);
//       return formatReply(err.message, HTTP_CODES.INTERNAL_SERVER_ERROR);
//     }
//     return formatReply("OK");
//   }