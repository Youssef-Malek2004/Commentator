using Google.Apis.YouTube.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;

namespace Commentator.Api.Services;

public interface IYouTubeService
{
    Task<IEnumerable<VideoDto>> GetUserVideos(string accessToken);
}

public class YouTubeService : IYouTubeService
{
    private readonly IConfiguration _configuration;

    public YouTubeService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IEnumerable<VideoDto>> GetUserVideos(string accessToken)
    {
        var youtubeService = new Google.Apis.YouTube.v3.YouTubeService(new BaseClientService.Initializer
        {
            HttpClientInitializer = Google.Apis.Auth.OAuth2.GoogleCredential.FromAccessToken(accessToken)
        });

        var channelsRequest = youtubeService.Channels.List("contentDetails");
        channelsRequest.Mine = true;
        var channelsResponse = await channelsRequest.ExecuteAsync();

        var videos = new List<VideoDto>();
        foreach (var channel in channelsResponse.Items)
        {
            var uploadsListId = channel.ContentDetails.RelatedPlaylists.Uploads;
            var playlistRequest = youtubeService.PlaylistItems.List("snippet");
            playlistRequest.PlaylistId = uploadsListId;
            playlistRequest.MaxResults = 50;

            var playlistResponse = await playlistRequest.ExecuteAsync();
            videos.AddRange(playlistResponse.Items.Select(item => new VideoDto
            {
                Id = item.Snippet.ResourceId.VideoId,
                Title = item.Snippet.Title,
                Thumbnail = item.Snippet.Thumbnails.High.Url,
                Views = "N/A" // You'd need another API call to get views
            }));
        }

        return videos;
    }
}

public class VideoDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public string Views { get; set; } = string.Empty;
}