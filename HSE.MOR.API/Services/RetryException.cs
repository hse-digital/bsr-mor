
using System.Runtime.Serialization;

namespace HSE.MOR.API.Services;

public class RetryException : Exception
{
    public RetryException()
    {
    }

    public RetryException(string? message) : base(message)
    {
    }

    public RetryException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

    protected RetryException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}
