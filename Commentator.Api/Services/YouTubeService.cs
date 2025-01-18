using Google.Apis.YouTube.v3;
using Google.Apis.Services;
using Google.Apis.YouTube.v3.Data;

namespace Commentator.Api.Services;

public interface IYouTubeService
{
    Task<IEnumerable<VideoDto>> GetUserVideos(string accessToken);
    Task<IEnumerable<VideoDto>> GetUserShorts(string accessToken);
    Task<IEnumerable<CommentDto>> GetVideoComments(string accessToken, string videoId);
    Task AddCommentResponse(string accessToken, string commentId, string response);
    Task BulkAnswerComments(string accessToken, string videoId);
}

public class YouTubeService : IYouTubeService
{
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

            var regularVideos = playlistResponse.Items.Where(item =>
                !(item.Snippet.Title.Contains("#shorts", StringComparison.OrdinalIgnoreCase) ||
                  (item.Snippet.Description?.Contains("#shorts", StringComparison.OrdinalIgnoreCase) ?? false)));

            var videoIds = regularVideos.Select(item => item.Snippet.ResourceId.VideoId).ToList();

            if (!videoIds.Any()) continue;

            var videosRequest = youtubeService.Videos.List("statistics,contentDetails");
            videosRequest.Id = string.Join(",", videoIds);
            var videosResponse = await videosRequest.ExecuteAsync();

            videos.AddRange(regularVideos.Select(item =>
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

    private async Task<bool> IsShort(Google.Apis.YouTube.v3.YouTubeService youtubeService, string videoId)
    {
        var videoRequest = youtubeService.Videos.List("contentDetails");
        videoRequest.Id = videoId;
        var videoResponse = await videoRequest.ExecuteAsync();
        var video = videoResponse.Items.FirstOrDefault();

        if (video == null) return false;

        // Check video dimensions - Shorts are typically vertical (height > width)
        var width = video.ContentDetails.Dimension?.Split('x').FirstOrDefault();
        var height = video.ContentDetails.Dimension?.Split('x').LastOrDefault();

        if (int.TryParse(width, out int w) && int.TryParse(height, out int h))
        {
            if (h > w) return true;
        }

        // Check duration - Shorts are 60 seconds or less
        var duration = video.ContentDetails.Duration;
        if (System.Xml.XmlConvert.ToTimeSpan(duration).TotalSeconds <= 60)
        {
            return true;
        }

        // Check title/description for #shorts
        return video.Snippet?.Title?.Contains("#shorts", StringComparison.OrdinalIgnoreCase) == true ||
               video.Snippet?.Description?.Contains("#shorts", StringComparison.OrdinalIgnoreCase) == true;
    }

    public async Task<IEnumerable<VideoDto>> GetUserShorts(string accessToken)
    {
        var youtubeService = new Google.Apis.YouTube.v3.YouTubeService(new BaseClientService.Initializer
        {
            HttpClientInitializer = Google.Apis.Auth.OAuth2.GoogleCredential.FromAccessToken(accessToken)
        });

        var channelsRequest = youtubeService.Channels.List("contentDetails");
        channelsRequest.Mine = true;
        var channelsResponse = await channelsRequest.ExecuteAsync();

        var shorts = new List<VideoDto>();

        foreach (var channel in channelsResponse.Items)
        {
            var uploadsListId = channel.ContentDetails.RelatedPlaylists.Uploads;
            var playlistRequest = youtubeService.PlaylistItems.List("snippet");
            playlistRequest.PlaylistId = uploadsListId;
            playlistRequest.MaxResults = 50;

            var playlistResponse = await playlistRequest.ExecuteAsync();
            var videoIds = playlistResponse.Items.Select(item => item.Snippet.ResourceId.VideoId).ToList();

            foreach (var videoId in videoIds)
            {
                if (await IsShort(youtubeService, videoId))
                {
                    var item = playlistResponse.Items.First(i => i.Snippet.ResourceId.VideoId == videoId);
                    var videosRequest = youtubeService.Videos.List("statistics");
                    videosRequest.Id = videoId;
                    var videosResponse = await videosRequest.ExecuteAsync();
                    var videoStats = videosResponse.Items.FirstOrDefault()?.Statistics;

                    shorts.Add(new VideoDto
                    {
                        Id = videoId,
                        Title = item.Snippet.Title,
                        Thumbnail = item.Snippet.Thumbnails.High.Url,
                        IsShort = true,
                        Statistics = new VideoStatistics
                        {
                            Views = videoStats?.ViewCount?.ToString() ?? "0",
                            Likes = videoStats?.LikeCount?.ToString() ?? "0",
                            CommentCount = videoStats?.CommentCount?.ToString() ?? "0"
                        }
                    });
                }
            }
        }

        return shorts;
    }

    public async Task<IEnumerable<CommentDto>> GetVideoComments(string accessToken, string videoId)
    {
        var youtubeService = new Google.Apis.YouTube.v3.YouTubeService(new BaseClientService.Initializer
        {
            HttpClientInitializer = Google.Apis.Auth.OAuth2.GoogleCredential.FromAccessToken(accessToken)
        });

        var commentsRequest = youtubeService.CommentThreads.List("snippet,replies");
        commentsRequest.VideoId = videoId;
        commentsRequest.Order = CommentThreadsResource.ListRequest.OrderEnum.Time;
        commentsRequest.MaxResults = 100;

        var response = await commentsRequest.ExecuteAsync();

        return response.Items
            .Where(item => !item.Replies?.Comments.Any() ?? true)
            .Select(item => new CommentDto
            {
                Id = item.Snippet.TopLevelComment.Id,
                Author = item.Snippet.TopLevelComment.Snippet.AuthorDisplayName,
                AuthorProfileImageUrl = item.Snippet.TopLevelComment.Snippet.AuthorProfileImageUrl,
                Text = item.Snippet.TopLevelComment.Snippet.TextDisplay,
                Likes = item.Snippet.TopLevelComment.Snippet.LikeCount ?? 0,
                AiResponse = null
            });
    }

    private string? GenerateMockAiResponse(string comment)
    {
        // Randomly decide whether to add an AI response (simulating unanswered comments)
        return Random.Shared.Next(2) == 0 ? null : $"Thank you for your comment! {comment.Split('.')[0]}. We appreciate your feedback!";
    }

    public async Task AddCommentResponse(string accessToken, string commentId, string response)
    {
        var youtubeService = new Google.Apis.YouTube.v3.YouTubeService(new BaseClientService.Initializer
        {
            HttpClientInitializer = Google.Apis.Auth.OAuth2.GoogleCredential.FromAccessToken(accessToken)
        });

        var comment = new Comment
        {
            Snippet = new CommentSnippet
            {
                ParentId = commentId,
                TextOriginal = response
            }
        };

        await youtubeService.Comments.Insert(comment, "snippet").ExecuteAsync();
    }

    public async Task BulkAnswerComments(string accessToken, string videoId)
    {
        var comments = await GetVideoComments(accessToken, videoId);
        foreach (var comment in comments.Where(c => c.AiResponse == null))
        {
            var response = GenerateMockAiResponse(comment.Text);
            if (response != null)
            {
                await AddCommentResponse(accessToken, comment.Id, response);
            }
        }
    }
}

public class VideoDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public bool IsShort { get; set; }
    public VideoStatistics Statistics { get; set; } = new();
}

public class VideoStatistics
{
    public string Views { get; set; } = "0";
    public string Likes { get; set; } = "0";
    public string CommentCount { get; set; } = "0";
}

public class CommentDto
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string AuthorProfileImageUrl { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public long Likes { get; set; }
    public string? AiResponse { get; set; }
}