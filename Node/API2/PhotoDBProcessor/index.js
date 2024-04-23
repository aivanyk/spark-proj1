const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

const credential = new AzureKeyCredential(process.env.visionkey);
// const client = createClient(process.env.visionendpoint, credential);
const client = createClient(process.env.visionendpoint, credential);

module.exports = async function (context, myQueueItem) {
    try {
        // Perform image analysis
        const features = [
            'Caption',
            'Tags'
        ];
        // const analysisResult = await client.analyzeImage(context.bindings.mySmallBlob, features);
        const imageUrl = `${process.env.photourl}/image/${myQueueItem}`;
        const result = await client.path('/imageanalysis:analyze').post({
            body: {
                url: imageUrl
            },
            queryParameters: {
                features: features
            },
            contentType: 'application/json'
        });
    
        const iaResult = result.body;
        // context.log(iaResult);

        const document = {
            Id: myQueueItem,
            Filename: myQueueItem,
            Size: context.bindings.myThumbnailBlob.length, // Provide actual size if available
            Dimensions: "200x200", // Provide actual dimensions if available
            thumbnailURL: `${process.env.photourl}/thumbnail/${myQueueItem}`,
            downsizedURL: `${process.env.photourl}/small-image/${myQueueItem}`,
            URL: `${process.env.photourl}/image/${myQueueItem}`,
            Text_caption: iaResult.captionResult.text,
            Entities: iaResult.tagsResult.values.map(tag => tag.name)
        };
        // context.log(document);

        context.bindings.imageDocument = document;
    } catch (error) {
        context.log.error('Error processing the image:', error);
        throw error;
    }
};
