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

            // Get video IDs for statistics request
            var videoIds = playlistResponse.Items.Select(item => item.Snippet.ResourceId.VideoId).ToList();

            // Get video statistics
            var videosRequest = youtubeService.Videos.List("statistics");
            videosRequest.Id = string.Join(",", videoIds);
            var videosResponse = await videosRequest.ExecuteAsync();

            videos.AddRange(playlistResponse.Items.Select(item =>
            {
                var videoStats = videosResponse.Items.FirstOrDefault(v => v.Id == item.Snippet.ResourceId.VideoId)?.Statistics;
                return new VideoDto
                {
                    Id = item.Snippet.ResourceId.VideoId,
                    Title = item.Snippet.Title,
                    Thumbnail = item.Snippet.Thumbnails.High.Url,
                    Statistics = new VideoStatistics
                    {
                        Views = videoStats?.ViewCount?.ToString() ?? "0",
                        Likes = videoStats?.LikeCount?.ToString() ?? "0",
                        CommentCount = videoStats?.CommentCount?.ToString() ?? "0"
                    }
                };
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
    public VideoStatistics Statistics { get; set; } = new();
}

public class VideoStatistics
{
    public string Views { get; set; } = "0";
    public string Likes { get; set; } = "0";
    public string CommentCount { get; set; } = "0";
}