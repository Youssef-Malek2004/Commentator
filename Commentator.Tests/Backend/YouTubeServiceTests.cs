using NUnit.Framework;
using Commentator.Api.Services;
using Google.Apis.Auth;

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
    public async Task GetUserVideos_WithInvalidToken_ThrowsException()
    {
        // Arrange
        var invalidToken = "invalid_token";

        // Act & Assert
        var exception = Assert.ThrowsAsync<Google.GoogleApiException>(
            async () => await _youtubeService.GetUserVideos(invalidToken)
        );

        Assert.That(exception.Message, Does.Contain("Unauthorized"));
    }
}