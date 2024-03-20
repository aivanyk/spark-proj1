import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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
        context.log.error(`Failed to retrieve the secret from Azure Key Vault: ${error}`);
        secretValue = "Error retrieving the secret.";
    }


    // Get the current date
    const today = new Date();

    // Format today's date as a string (e.g., '2024-02-16')
    const dateString = today.toISOString().split('T')[0];

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "Today's date is " + dateString; 

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;