using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using HSE.MOR.API.Services;
using Microsoft.Extensions.Options;

namespace HSE.MOR.API.BlobStore;

public interface IBlobSASUri
{
    string GetSASUri(string blobName);
}
public class BlobSASUri : IBlobSASUri
{
    private readonly IBlobClient blobClient;
    private readonly BlobStoreOptions blobStoreOptions;

    public BlobSASUri(IBlobClient blobClient, IOptions<BlobStoreOptions> blobStoreOptions)
    {
        this.blobClient = blobClient;
        this.blobStoreOptions = blobStoreOptions.Value;
    }

    public string GetSASUri(string blobName)
    {
        var blobServiceClient = new BlobServiceClient(blobStoreOptions.ConnectionString);

        //  Gets a reference to the container.
        var containerClient = blobServiceClient.GetBlobContainerClient(blobStoreOptions.ContainerName);

        //  Gets a reference to the blob in the container
        BlobClient blobClient = containerClient.GetBlobClient(blobName);
        Uri fullUri = blobClient.GenerateSasUri(BlobSasPermissions.Write | BlobSasPermissions.Delete, DateTime.UtcNow.AddDays(1));

        return fullUri.ToString();
    }
}
