const sharp = require('sharp');

module.exports = async function (context) {
    context.log('Upload image: ', context.bindings.myQueueItem);

    const inputBlob = context.bindings.myInputBlob; // The input blob from the "images/{queueTrigger}" path
    const metadata = await sharp(inputBlob).metadata();

    try {
        // Create a 200x200 thumbnail
        const thumbnailBuffer = await sharp(inputBlob)
          .resize(200, 200)
          .toBuffer();
    
        const minimumSize = 50;
        const width = metadata.width < minimumSize ? minimumSize : 640;
        const height = metadata.height < minimumSize ? minimumSize : 640;
        const smallImageBuffer = await sharp(inputBlob)
          .resize(width, height, { fit: 'inside' })
          .toBuffer();
    
        // Use the output bindings to save the processed images
        context.bindings.myThumbnailBlob = thumbnailBuffer;
        context.bindings.mySmallBlob = smallImageBuffer;
        context.bindings.outputQueueItem = context.bindings.myQueueItem;
    } catch (error) {
        context.log.error('Error processing image:', error);
        throw error; // Rethrowing the error will cause the function to fail and can trigger retries as per the function's configuration.
    }
};
