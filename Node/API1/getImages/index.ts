import { app, HttpResponseInit, InvocationContext, output, trigger, HttpRequest, input } from "@azure/functions"
import * as multipart from 'parse-multipart';

const cosmosInput = input.cosmosDB({
    databaseName: 'images',
    containerName: 'images',
    connection: 'CosmosDB',
});

interface imageDescription {
    Id: string,
    Filename: string,
    Size: string,
    Dimensions: string,
    thumbnailURL: string,
    downsizedURL: string,
    URL: string,
    Text_caption: string,
    Entities: string,
}

export async function getImages(request, context: InvocationContext): Promise<HttpResponseInit> {
    const toDoItem = <imageDescription[]>context.extraInputs.get(cosmosInput);
    if (!toDoItem) {
        return {
            status: 404,
            body: 'ToDo item not found',
        };
    } else {
        return {
            status: 200,
            jsonBody: toDoItem,
        };
    }
};

app.http('getImages', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    handler: getImages
});
