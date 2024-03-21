module.exports = async function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item: ', myQueueItem);
    context.log('The third secret is: ', process.env.kvsecret3);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id =', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
};