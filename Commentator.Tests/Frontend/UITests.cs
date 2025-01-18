using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace Commentator.Tests.Frontend;

public class UiTests
{
    private IWebDriver _driver;
    private WebDriverWait _wait;
    private const string BaseUrl = "http://localhost:3001";

    [SetUp]
    public void Setup()
    {
        var options = new ChromeOptions();

        // options.AddArgument("--headless");
        options.AddArgument("--start-maximized");

        _driver = new ChromeDriver(options);
        _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
    }

    [Test]
    public void HomePage_LoadsCorrectly()
    {
        _driver.Navigate().GoToUrl(BaseUrl);

        // Check main elements
        var brandText = _wait.Until(d => d.FindElement(By.ClassName("brand-text")));
        var subtitle = _wait.Until(d => d.FindElement(By.XPath("//p[contains(text(), 'AI-Powered')]")));
        var googleButton = _wait.Until(d => d.FindElement(By.XPath("//button[contains(@class, 'bg-white')]")));

        // Verify content
        Assert.That(brandText.Text, Does.Contain("Commentator"));
        Assert.That(subtitle.Text, Does.Contain("AI-Powered Social Media Engagement"));
        Assert.That(googleButton.Text, Does.Contain("Continue with Google"));
    }

    [Test]
    public void ThemeToggle_IsPresent()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        var themeToggle = _wait.Until(d => d.FindElement(By.CssSelector("button[class*='inline-flex']")));
        Assert.That(themeToggle, Is.Not.Null);
    }

    [Test]
    public void Footer_LinksArePresent()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        var termsLink = _wait.Until(d => d.FindElement(By.XPath("//a[contains(text(), 'Terms of Service')]")));
        var privacyLink = _wait.Until(d => d.FindElement(By.XPath("//a[contains(text(), 'Privacy Policy')]")));

        Assert.That(termsLink.GetAttribute("href"), Does.Contain("/terms"));
        Assert.That(privacyLink.GetAttribute("href"), Does.Contain("/privacy"));
    }

    [TearDown]
    public void TearDown()
    {
        _driver.Quit();
        _driver.Dispose();
    }
}