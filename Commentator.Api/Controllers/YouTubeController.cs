using Microsoft.AspNetCore.Mvc;
using Commentator.Api.Services;

namespace Commentator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YouTubeController : ControllerBase
{
    private readonly IYouTubeService _youTubeService;

    public YouTubeController(IYouTubeService youTubeService)
    {
        _youTubeService = youTubeService;
    }

    [HttpGet("videos")]
    public async Task<IActionResult> GetVideos([FromHeader(Name = "Authorization")] string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return Unauthorized();

        var accessToken = authorization.Substring("Bearer ".Length);

        try
        {
            var videos = await _youTubeService.GetUserVideos(accessToken);
            return Ok(videos);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
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
            var comments = await _youTubeService.GetVideoComments(accessToken, videoId);
            return Ok(comments);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}