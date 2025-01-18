using NUnit.Framework;
using Commentator.Api.Services;

namespace Commentator.Tests.Backend;

public class YouTubeServiceTests
{
    private IYouTubeService _youtubeService;

    [SetUp]
    public void Setup()
    {
        _youtubeService = new YouTubeService();
    }

    [Test]
    public Task GetUserVideos_WithInvalidToken_ThrowsException()
    {
        var invalidToken = "invalid_token";

        var exception = Assert.ThrowsAsync<Google.GoogleApiException>(
            async () => await _youtubeService.GetUserVideos(invalidToken)
        );

        Assert.That(exception?.Message, Does.Contain("Unauthorized"));
        return Task.CompletedTask;
    }

    [Test]
    public Task GetUserShorts_WithInvalidToken_ThrowsException()
    {
        var invalidToken = "invalid_token";

        var exception = Assert.ThrowsAsync<Google.GoogleApiException>(
            async () => await _youtubeService.GetUserShorts(invalidToken)
        );

        Assert.That(exception?.Message, Does.Contain("Unauthorized"));
        return Task.CompletedTask;
    }
}