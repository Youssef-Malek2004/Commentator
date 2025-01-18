using Microsoft.AspNetCore.Mvc;
using Commentator.Api.Services;

namespace Commentator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YouTubeController(IYouTubeService youTubeService, ILogger<YouTubeController> logger) : ControllerBase
{
    [HttpGet("videos")]
    public async Task<IActionResult> GetVideos([FromHeader(Name = "Authorization")] string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            var videos = await youTubeService.GetUserVideos(accessToken);
            return Ok(videos);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Trace.TraceError(ex.Message);
            System.Diagnostics.Trace.TraceError(ex.InnerException?.ToString());
            System.Diagnostics.Trace.TraceError(ex.StackTrace);

            return BadRequest(ex.Message + "BABA" + ex.InnerException?.ToString() + ex.StackTrace);
        }
    }

    [HttpGet("videos/{videoId}/comments")]
    public async Task<IActionResult> GetVideoComments(string videoId, [FromHeader(Name = "Authorization")] string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            var comments = await youTubeService.GetVideoComments(accessToken, videoId);
            return Ok(comments);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("comments/{commentId}/reply")]
    public async Task<IActionResult> AddCommentResponse(
        string commentId,
        [FromHeader(Name = "Authorization")] string authorization,
        [FromBody] AddResponseRequest request)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            await youTubeService.AddCommentResponse(accessToken, commentId, request.Response);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("videos/{videoId}/bulk-answer")]
    public async Task<IActionResult> BulkAnswerComments(string videoId, [FromHeader(Name = "Authorization")] string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            await youTubeService.BulkAnswerComments(accessToken, videoId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("shorts")]
    public async Task<IActionResult> GetShorts([FromHeader(Name = "Authorization")] string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            var shorts = await youTubeService.GetUserShorts(accessToken);
            return Ok(shorts);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    public class AddResponseRequest
    {
        public string Response { get; set; } = string.Empty;
    }
}