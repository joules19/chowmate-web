# Chowmate Survey System - Backend Implementation Guide

## Overview
This document provides a comprehensive implementation guide for the Chowmate Survey System backend. The system enables Typeform-like surveys with automatic email delivery of rewards and one-submission-per-user validation.

## 🎯 Key Features Required

### Core Functionality
- ✅ **One Submission Per User**: Session-based and user-based validation
- ✅ **Typeform-like UI**: Beautiful, accessible, mobile-responsive frontend
- ✅ **Email Integration**: Automatic reward delivery via email
- ✅ **Data Analytics**: Response tracking and analytics
- ✅ **Admin Management**: Survey creation and management

### Business Requirements
- **Reward System**: Automatic free delivery voucher generation
- **Email Notifications**: Customer emails with delivery instructions
- **Analytics Dashboard**: Survey response insights
- **Multi-question Types**: Text, multiple choice, rating, etc.

## 🏗️ Database Schema

### 1. Surveys Table
```sql
CREATE TABLE Surveys (
    Id NVARCHAR(450) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Status INT NOT NULL DEFAULT 0, -- 0:Draft, 1:Active, 2:Paused, 3:Completed, 4:Archived
    StartDate DATETIME2,
    EndDate DATETIME2,
    AllowMultipleSubmissions BIT NOT NULL DEFAULT 0,
    RequireAuthentication BIT NOT NULL DEFAULT 1,
    IncentiveDescription NVARCHAR(500),
    CreatedByUserId NVARCHAR(450),
    CreatedAt DATETIME2 NOT NULL,
    CreatedBy NVARCHAR(MAX),
    ModifiedAt DATETIME2,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2
);

-- Indexes for performance
CREATE INDEX IX_Surveys_Status ON Surveys (Status);
CREATE INDEX IX_Surveys_DateRange ON Surveys (StartDate, EndDate);
CREATE INDEX IX_Surveys_CreatedAt ON Surveys (CreatedAt DESC);
```

### 2. Survey Questions Table
```sql
CREATE TABLE SurveyQuestions (
    Id NVARCHAR(450) PRIMARY KEY,
    SurveyId NVARCHAR(450) NOT NULL,
    Text NVARCHAR(500) NOT NULL,
    Type INT NOT NULL, -- 1:ShortText, 2:LongText, 3:MultipleChoice, 4:MultipleSelect, 5:Rating, 6:YesNo, 7:Dropdown
    [Order] INT NOT NULL,
    IsRequired BIT NOT NULL DEFAULT 0,
    Description NVARCHAR(1000),
    OptionsJson NVARCHAR(MAX), -- JSON array for multiple choice options
    ValidationRules NVARCHAR(MAX), -- JSON for validation rules (min/max rating, etc.)
    CreatedAt DATETIME2 NOT NULL,
    CreatedBy NVARCHAR(MAX),
    ModifiedAt DATETIME2,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2,
    
    FOREIGN KEY (SurveyId) REFERENCES Surveys(Id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IX_SurveyQuestions_SurveyId_Order ON SurveyQuestions (SurveyId, [Order]);
CREATE INDEX IX_SurveyQuestions_Type ON SurveyQuestions (Type);
```

### 3. Survey Responses Table
```sql
CREATE TABLE SurveyResponses (
    Id NVARCHAR(450) PRIMARY KEY,
    SurveyId NVARCHAR(450) NOT NULL,
    UserId NVARCHAR(450), -- Nullable for anonymous responses
    SessionId NVARCHAR(100), -- For tracking anonymous users
    StartedAt DATETIME2 NOT NULL,
    CompletedAt DATETIME2,
    Status INT NOT NULL DEFAULT 1, -- 1:InProgress, 2:Completed, 3:Abandoned
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    EmailSent BIT NOT NULL DEFAULT 0,
    EmailSentAt DATETIME2,
    RewardCode NVARCHAR(50), -- Generated reward code
    CreatedAt DATETIME2 NOT NULL,
    CreatedBy NVARCHAR(MAX),
    ModifiedAt DATETIME2,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2,
    
    FOREIGN KEY (SurveyId) REFERENCES Surveys(Id) ON DELETE CASCADE
);

-- Indexes for one-submission validation
CREATE INDEX IX_SurveyResponses_SurveyId_UserId ON SurveyResponses (SurveyId, UserId);
CREATE INDEX IX_SurveyResponses_SurveyId_SessionId ON SurveyResponses (SurveyId, SessionId);
CREATE INDEX IX_SurveyResponses_Status ON SurveyResponses (Status);
CREATE INDEX IX_SurveyResponses_CompletedAt ON SurveyResponses (CompletedAt DESC);
```

### 4. Survey Answers Table
```sql
CREATE TABLE SurveyAnswers (
    Id NVARCHAR(450) PRIMARY KEY,
    ResponseId NVARCHAR(450) NOT NULL,
    QuestionId NVARCHAR(450) NOT NULL,
    AnswerText NVARCHAR(MAX),
    SelectedOptions NVARCHAR(MAX), -- JSON array for multiple selections
    NumericValue INT, -- For rating questions
    CreatedAt DATETIME2 NOT NULL,
    CreatedBy NVARCHAR(MAX),
    ModifiedAt DATETIME2,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2,
    
    FOREIGN KEY (ResponseId) REFERENCES SurveyResponses(Id) ON DELETE CASCADE,
    FOREIGN KEY (QuestionId) REFERENCES SurveyQuestions(Id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX IX_SurveyAnswers_ResponseId ON SurveyAnswers (ResponseId);
CREATE INDEX IX_SurveyAnswers_QuestionId ON SurveyAnswers (QuestionId);
```

## 🔧 .NET C# Implementation

### 1. Database Seeding for Chowmate Feedback Survey

```csharp
// Data/SurveySeeder.cs
namespace ChowmateApi.Data
{
    public static class SurveySeeder
    {
        public static async Task SeedChowmateFeedbackSurvey(ApplicationDbContext context)
        {
            // Check if survey already exists
            if (await context.Surveys.AnyAsync(s => s.Id == "chowmate-feedback"))
                return;

            var survey = new Survey
            {
                Id = "chowmate-feedback",
                Title = "What's keeping you from placing your first (or next) order on Chowmate?",
                Description = "Take 2 minutes to answer • Get free delivery on your first order just for answering",
                IncentiveDescription = "Get free delivery on your first order just for answering",
                Status = SurveyStatus.Active,
                AllowMultipleSubmissions = false,
                RequireAuthentication = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            var questions = new List<SurveyQuestion>
            {
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "How often do you usually order food online?",
                    Type = QuestionType.MultipleChoice,
                    Order = 1,
                    IsRequired = true,
                    OptionsJson = JsonSerializer.Serialize(new[] { "Daily", "A few times a week", "Once in a while", "Rarely" }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "Have you used Chowmate to order food?",
                    Type = QuestionType.MultipleChoice,
                    Order = 2,
                    IsRequired = true,
                    OptionsJson = JsonSerializer.Serialize(new[] { "Yes", "Not yet" }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "How would you rate your experience?",
                    Type = QuestionType.Rating,
                    Order = 3,
                    IsRequired = false,
                    ValidationRules = JsonSerializer.Serialize(new { minRating = 1, maxRating = 5 }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "What's the main reason you haven't ordered again or yet? (Select all that apply)",
                    Type = QuestionType.MultipleSelect,
                    Order = 4,
                    IsRequired = false,
                    OptionsJson = JsonSerializer.Serialize(new[]
                    {
                        "Delivery fee is too expensive",
                        "I don't trust the food quality/delivery",
                        "Not enough restaurants/food options I like",
                        "I'm not sure how the app works",
                        "Payment or app issue",
                        "I prefer calling restaurants directly",
                        "I didn't know about Chowmate until now",
                        "Food took too long to arrive",
                        "I just forgot about the app",
                        "Other"
                    }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "What would convince you to place your first order TODAY or AGAIN? (Select all that apply)",
                    Type = QuestionType.MultipleSelect,
                    Order = 5,
                    IsRequired = true,
                    OptionsJson = JsonSerializer.Serialize(new[]
                    {
                        "Special offers or free delivery days",
                        "Discounts or loyalty rewards",
                        "More restaurants or meal variety",
                        "Better customer support",
                        "Faster delivery",
                        "Easier payment options",
                        "Other"
                    }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "Which area do you order from most often?",
                    Type = QuestionType.MultipleChoice,
                    Order = 6,
                    IsRequired = true,
                    OptionsJson = JsonSerializer.Serialize(new[] { "Mowe", "Redemption Camp", "Lotto" }),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "Any suggestions that would make Chowmate your go-to food app?",
                    Type = QuestionType.LongText,
                    Order = 7,
                    IsRequired = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new SurveyQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = survey.Id,
                    Text = "Enter your email to receive your free delivery reward",
                    Type = QuestionType.ShortText,
                    Order = 8,
                    IsRequired = true,
                    Description = "We'll send your free delivery instructions to this email",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            survey.Questions = questions;

            context.Surveys.Add(survey);
            await context.SaveChangesAsync();
        }
    }
}
```

### 2. Program.cs Integration for Seeding

```csharp
// Program.cs - Add this after app.Build() and before app.Run()
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Ensure database is created
    await context.Database.EnsureCreatedAsync();
    
    // Seed the Chowmate feedback survey
    await SurveySeeder.SeedChowmateFeedbackSurvey(context);
}
```

### 3. Domain Models

```csharp
// Models/Survey/Survey.cs
using System.ComponentModel.DataAnnotations;

namespace ChowmateApi.Models.Survey
{
    public class Survey : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }
        
        [MaxLength(1000)]
        public string Description { get; set; }
        
        public SurveyStatus Status { get; set; } = SurveyStatus.Draft;
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        public bool AllowMultipleSubmissions { get; set; } = false;
        public bool RequireAuthentication { get; set; } = true;
        
        [MaxLength(500)]
        public string IncentiveDescription { get; set; }
        
        public string CreatedByUserId { get; set; }
        
        // Navigation properties
        public virtual ICollection<SurveyQuestion> Questions { get; set; } = new List<SurveyQuestion>();
        public virtual ICollection<SurveyResponse> Responses { get; set; } = new List<SurveyResponse>();
    }

    public enum SurveyStatus
    {
        Draft = 0,
        Active = 1,
        Paused = 2,
        Completed = 3,
        Archived = 4
    }

    public enum QuestionType
    {
        ShortText = 1,
        LongText = 2,
        MultipleChoice = 3,
        MultipleSelect = 4,
        Rating = 5,
        YesNo = 6,
        Dropdown = 7
    }

    public enum ResponseStatus
    {
        InProgress = 1,
        Completed = 2,
        Abandoned = 3
    }
}
```

### 2. Repository Interface & Implementation

```csharp
// Repositories/Interfaces/ISurveyRepository.cs
namespace ChowmateApi.Repositories.Interfaces
{
    public interface ISurveyRepository : IBaseRepository<Survey>
    {
        Task<Survey> GetSurveyWithQuestionsAsync(string surveyId);
        Task<IEnumerable<Survey>> GetActiveSurveysAsync();
        Task<bool> HasUserSubmittedSurveyAsync(string surveyId, string userId);
        Task<bool> HasSessionSubmittedSurveyAsync(string surveyId, string sessionId);
        Task<SurveyResponse> CreateResponseAsync(SurveyResponse response);
        Task<SurveyResponse> UpdateResponseAsync(SurveyResponse response);
        Task<IEnumerable<SurveyResponse>> GetSurveyResponsesAsync(string surveyId, int pageNumber = 1, int pageSize = 50);
    }
}
```

### 3. Service Layer with Email Integration

```csharp
// Services/SurveyService.cs
namespace ChowmateApi.Services
{
    public class SurveyService : ISurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly IEmailService _emailService;
        private readonly ILogger<SurveyService> _logger;
        private readonly IRewardService _rewardService;

        public async Task<ServiceResult<string>> SubmitSurveyResponseAsync(
            SubmitSurveyResponseDto dto, 
            string userId, 
            string ipAddress, 
            string userAgent)
        {
            try
            {
                // 1. Validate survey exists and is active
                var survey = await _surveyRepository.GetSurveyWithQuestionsAsync(dto.SurveyId);
                if (survey == null || survey.Status != SurveyStatus.Active)
                    return ServiceResult<string>.Failure("Survey is not available");

                // 2. Check one-submission-per-user validation
                if (!survey.AllowMultipleSubmissions)
                {
                    bool hasSubmitted = !string.IsNullOrEmpty(userId)
                        ? await _surveyRepository.HasUserSubmittedSurveyAsync(dto.SurveyId, userId)
                        : await _surveyRepository.HasSessionSubmittedSurveyAsync(dto.SurveyId, dto.SessionId);

                    if (hasSubmitted)
                        return ServiceResult<string>.Failure("You have already submitted this survey");
                }

                // 3. Validate required questions
                var requiredQuestions = survey.Questions.Where(q => q.IsRequired).ToList();
                var answeredQuestionIds = dto.Answers.Select(a => a.QuestionId).ToHashSet();
                
                foreach (var requiredQuestion in requiredQuestions)
                {
                    if (!answeredQuestionIds.Contains(requiredQuestion.Id))
                        return ServiceResult<string>.Failure($"Question '{requiredQuestion.Text}' is required");
                }

                // 4. Generate reward code
                var rewardCode = _rewardService.GenerateRewardCode(dto.SurveyId, userId ?? dto.SessionId);

                // 5. Create response record
                var response = new SurveyResponse
                {
                    Id = Guid.NewGuid().ToString(),
                    SurveyId = dto.SurveyId,
                    UserId = userId,
                    SessionId = dto.SessionId,
                    StartedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow,
                    Status = ResponseStatus.Completed,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    RewardCode = rewardCode,
                    CreatedAt = DateTime.UtcNow,
                    Answers = dto.Answers.Select(a => new SurveyAnswer
                    {
                        Id = Guid.NewGuid().ToString(),
                        QuestionId = a.QuestionId,
                        AnswerText = a.AnswerText,
                        SelectedOptions = a.SelectedOptions?.Any() == true ? JsonSerializer.Serialize(a.SelectedOptions) : null,
                        NumericValue = a.NumericValue,
                        CreatedAt = DateTime.UtcNow
                    }).ToList()
                };

                var createdResponse = await _surveyRepository.CreateResponseAsync(response);

                // 6. Send reward email asynchronously
                _ = Task.Run(async () => await SendRewardEmailAsync(survey, createdResponse));

                return ServiceResult<string>.Success(createdResponse.Id, "Survey response submitted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting survey response for survey {SurveyId}", dto.SurveyId);
                return ServiceResult<string>.Failure("Failed to submit survey response");
            }
        }

        private async Task SendRewardEmailAsync(Survey survey, SurveyResponse response)
        {
            try
            {
                // Get user email and name
                var (userEmail, userName) = await GetUserContactInfoAsync(response.UserId, response);
                
                if (string.IsNullOrEmpty(userEmail))
                {
                    _logger.LogWarning("No email found for survey response {ResponseId}", response.Id);
                    return;
                }

                var emailData = new SurveyRewardEmailData
                {
                    SurveyId = survey.Id,
                    SurveyTitle = survey.Title,
                    IncentiveDescription = survey.IncentiveDescription,
                    CustomerName = userName,
                    ValidUntil = DateTime.UtcNow.AddDays(30)
                };

                var emailSent = await _surveyEmailService.SendSurveyRewardEmailAsync(userEmail, userName, emailData);
                
                if (emailSent)
                {
                    // Update response to mark email as sent
                    response.EmailSent = true;
                    response.EmailSentAt = DateTime.UtcNow;
                    await _surveyRepository.UpdateResponseAsync(response);
                    
                    _logger.LogInformation("Reward email sent successfully for response {ResponseId} to {Email}", 
                        response.Id, userEmail);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reward email for response {ResponseId}", response.Id);
            }
        }

        private async Task<(string email, string name)> GetUserContactInfoAsync(string userId, SurveyResponse response)
        {
            // If user is authenticated, get from user service
            if (!string.IsNullOrEmpty(userId))
            {
                // Implementation depends on your user system
                // var user = await _userService.GetUserAsync(userId);
                // return (user.Email, user.FullName);
            }

            // For anonymous users, check if contact info was collected in the survey
            // This is a common pattern - add contact questions to your survey
            var emailAnswer = response.Answers?
                .FirstOrDefault(a => a.Question?.Text?.ToLower().Contains("email") == true)?
                .AnswerText;
                
            var nameAnswer = response.Answers?
                .FirstOrDefault(a => a.Question?.Text?.ToLower().Contains("name") == true)?
                .AnswerText;

            return (emailAnswer, nameAnswer);
        }
    }
}
```

### 4. Postmark Email Integration (Using Existing Service)

```csharp
// Services/SurveyEmailService.cs - Extension to your existing PostmarkEmailService
namespace ChowmateApi.Services
{
    public interface ISurveyEmailService
    {
        Task<bool> SendSurveyRewardEmailAsync(string recipientEmail, string recipientName, SurveyRewardEmailData data);
    }

    public class SurveyEmailService : ISurveyEmailService
    {
        private readonly PostmarkEmailService _postmarkEmailService; // Your existing service
        private readonly ILogger<SurveyEmailService> _logger;

        public SurveyEmailService(PostmarkEmailService postmarkEmailService, ILogger<SurveyEmailService> logger)
        {
            _postmarkEmailService = postmarkEmailService;
            _logger = logger;
        }

        public async Task<bool> SendSurveyRewardEmailAsync(string recipientEmail, string recipientName, SurveyRewardEmailData data)
        {
            try
            {
                var subject = "🎉 Your Free Delivery Reward is Ready!";
                var htmlContent = GenerateRewardEmailHtml(data);
                var textContent = GenerateRewardEmailText(data);

                // Use your existing PostmarkEmailService method
                var result = await _postmarkEmailService.SendEmailAsync(
                    recipientEmail,
                    recipientName,
                    subject,
                    htmlContent,
                    textContent
                );

                if (result)
                {
                    _logger.LogInformation("Survey reward email sent successfully to {Email} for survey {SurveyId}", 
                        recipientEmail, data.SurveyId);
                }
                else
                {
                    _logger.LogWarning("Failed to send survey reward email to {Email} for survey {SurveyId}", 
                        recipientEmail, data.SurveyId);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending survey reward email to {Email} for survey {SurveyId}", 
                    recipientEmail, data.SurveyId);
                return false;
            }
        }

        private string GenerateRewardEmailHtml(SurveyRewardEmailData data)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Your Chowmate Reward</title>
    <style>
        body {{ font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #FFC107, #FF9800); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #FFFCF4; padding: 30px; border-radius: 0 0 10px 10px; }}
        .reward-banner {{ background: #fff; border: 2px solid #FFC107; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .reward-text {{ font-size: 18px; font-weight: bold; color: #FF9800; margin-bottom: 10px; }}
        .cta-button {{ display: inline-block; background: #FFC107; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .instructions {{ background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC107; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Thank You for Your Feedback!</h1>
            <p>Your free delivery reward is ready!</p>
        </div>
        <div class='content'>
            <p>Hi {data.CustomerName ?? "there"}!</p>
            
            <p>Thank you for taking the time to complete our survey: <strong>{data.SurveyTitle}</strong></p>
            
            <div class='reward-banner'>
                <div class='reward-text'>{data.IncentiveDescription}</div>
                <p style='color: #666; margin: 0;'>Valid until {data.ValidUntil:MMMM dd, yyyy}</p>
            </div>
            
            <div class='instructions'>
                <p><strong>🚀 How to get your free delivery:</strong></p>
                <ol>
                    <li>Open the Chowmate app or visit our website</li>
                    <li>Browse and add your favorite meals to cart</li>
                    <li>Your free delivery will be automatically applied at checkout</li>
                    <li>Enjoy your meal with zero delivery fees!</li>
                </ol>
            </div>
            
            <div style='text-align: center;'>
                <a href='https://chowmate.app/app' class='cta-button'>Order Now - Free Delivery</a>
            </div>
            
            <p>We're working hard to improve Chowmate based on your valuable feedback. Your input helps us serve you and thousands of other food lovers better!</p>
            
            <p>Best regards,<br><strong>The Chowmate Team</strong></p>
            
            <hr style='margin: 30px 0; border: none; border-top: 1px solid #ddd;'>
            <p style='font-size: 12px; color: #666;'>
                This email was sent because you completed a Chowmate feedback survey. 
                Your free delivery reward is valid for 30 days from the date of this email.
            </p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateRewardEmailText(SurveyRewardEmailData data)
        {
            return $@"
🎉 Thank You for Your Feedback!

Hi {data.CustomerName ?? "there"},

Thank you for taking the time to complete our survey: {data.SurveyTitle}

Your reward: {data.IncentiveDescription}
Valid until: {data.ValidUntil:MMMM dd, yyyy}

How to get your free delivery:
1. Open the Chowmate app or visit our website
2. Browse and add your favorite meals to cart  
3. Your free delivery will be automatically applied at checkout
4. Enjoy your meal with zero delivery fees!

Order now: https://chowmate.app/app

We're working hard to improve Chowmate based on your valuable feedback. Your input helps us serve you and thousands of other food lovers better!

Best regards,
The Chowmate Team

---
This email was sent because you completed a Chowmate feedback survey. Your free delivery reward is valid for 30 days from the date of this email.
";
        }
    }

    public class SurveyRewardEmailData
    {
        public string SurveyId { get; set; }
        public string SurveyTitle { get; set; }
        public string IncentiveDescription { get; set; }
        public string CustomerName { get; set; }
        public DateTime ValidUntil { get; set; }
    }
}
```

### 5. Reward Service

```csharp
// Services/RewardService.cs
namespace ChowmateApi.Services
{
    public interface IRewardService
    {
        string GenerateRewardCode(string surveyId, string identifier);
        Task<bool> ValidateRewardCodeAsync(string rewardCode);
        Task<bool> RedeemRewardCodeAsync(string rewardCode, string orderId);
    }

    public class RewardService : IRewardService
    {
        public string GenerateRewardCode(string surveyId, string identifier)
        {
            // Generate a unique reward code
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var hash = ComputeHash($"{surveyId}-{identifier}-{timestamp}");
            
            // Create a readable code format: SURVEY-XXXX
            var shortHash = hash.Substring(0, 8).ToUpper();
            return $"SURVEY-{shortHash}";
        }

        private string ComputeHash(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }

        public async Task<bool> ValidateRewardCodeAsync(string rewardCode)
        {
            // Check if code exists and hasn't been redeemed
            // Implementation depends on your order/coupon system
            return true;
        }

        public async Task<bool> RedeemRewardCodeAsync(string rewardCode, string orderId)
        {
            // Mark code as redeemed
            // Implementation depends on your order/coupon system
            return true;
        }
    }
}
```

## 🚀 API Endpoints

### 1. Survey Controller

```csharp
// Controllers/SurveyController.cs
[ApiController]
[Route("api/[controller]")]
public class SurveyController : ControllerBase
{
    private readonly ISurveyService _surveyService;

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<SurveyResponseDto>>>> GetActiveSurveys()
    {
        var result = await _surveyService.GetActiveSurveysAsync();
        return result.IsSuccess 
            ? Ok(ApiResponse<IEnumerable<SurveyResponseDto>>.SuccessResult(result.Data))
            : BadRequest(ApiResponse<IEnumerable<SurveyResponseDto>>.ErrorResult(result.ErrorMessage));
    }

    [HttpGet("{surveyId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<SurveyResponseDto>>> GetSurvey(string surveyId)
    {
        var result = await _surveyService.GetSurveyAsync(surveyId);
        return result.IsSuccess 
            ? Ok(ApiResponse<SurveyResponseDto>.SuccessResult(result.Data))
            : NotFound(ApiResponse<SurveyResponseDto>.ErrorResult(result.ErrorMessage));
    }

    [HttpPost("{surveyId}/submit")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<string>>> SubmitSurveyResponse(
        string surveyId, 
        [FromBody] SubmitSurveyResponseDto dto)
    {
        dto.SurveyId = surveyId;
        
        var userId = User.Identity.IsAuthenticated ? User.FindFirst(ClaimTypes.NameIdentifier)?.Value : null;
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers["User-Agent"].ToString();

        var result = await _surveyService.SubmitSurveyResponseAsync(dto, userId, ipAddress, userAgent);
        
        return result.IsSuccess 
            ? Ok(ApiResponse<string>.SuccessResult(result.Data, "Survey response submitted successfully"))
            : BadRequest(ApiResponse<string>.ErrorResult(result.ErrorMessage));
    }

    [HttpGet("{surveyId}/can-submit")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<bool>>> CanSubmitSurvey(
        string surveyId, 
        [FromQuery] string sessionId = null)
    {
        var userId = User.Identity.IsAuthenticated ? User.FindFirst(ClaimTypes.NameIdentifier)?.Value : null;
        var result = await _surveyService.CanUserSubmitSurveyAsync(surveyId, userId, sessionId);
        
        return result.IsSuccess 
            ? Ok(ApiResponse<bool>.SuccessResult(result.Data))
            : BadRequest(ApiResponse<bool>.ErrorResult(result.ErrorMessage));
    }

    [HttpGet("{surveyId}/analytics")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ApiResponse<SurveyAnalyticsDto>>> GetSurveyAnalytics(string surveyId)
    {
        var result = await _surveyService.GetSurveyAnalyticsAsync(surveyId);
        
        return result.IsSuccess 
            ? Ok(ApiResponse<SurveyAnalyticsDto>.SuccessResult(result.Data))
            : BadRequest(ApiResponse<SurveyAnalyticsDto>.ErrorResult(result.ErrorMessage));
    }
}
```

## 📧 Key Integration Points

### Frontend API Calls
The frontend makes these key API calls:

1. **GET /api/surveys/{surveyId}** - Load survey data
2. **GET /api/surveys/{surveyId}/can-submit** - Check submission eligibility  
3. **POST /api/surveys/{surveyId}/submit** - Submit survey response
4. **GET /api/surveys/active** - List active surveys

### Email Trigger Flow
1. User submits survey → `SubmitSurveyResponseAsync()`
2. Generate reward code → `_rewardService.GenerateRewardCode()`
3. Save response to database → `_surveyRepository.CreateResponseAsync()`
4. Send email asynchronously → `SendRewardEmailAsync()`
5. Update email sent status → `_surveyRepository.UpdateResponseAsync()`

### One-Submission Validation
- **Authenticated users**: Check by `UserId`
- **Anonymous users**: Check by `SessionId`
- **Business rule**: Configurable via `AllowMultipleSubmissions`

## 🔧 Configuration

### appsettings.json
```json
{
  "SendGrid": {
    "ApiKey": "your-sendgrid-api-key"
  },
  "Survey": {
    "RewardValidityDays": 30,
    "MaxResponsesPerSurvey": 10000,
    "EmailFromAddress": "noreply@chowmate.app",
    "EmailFromName": "Chowmate"
  },
  "ConnectionStrings": {
    "DefaultConnection": "your-database-connection-string"
  }
}
```

### Startup.cs Registration
```csharp
// Program.cs or Startup.cs
services.AddScoped<ISurveyRepository, SurveyRepository>();
services.AddScoped<ISurveyService, SurveyService>();
services.AddScoped<ISurveyEmailService, SurveyEmailService>();
services.AddScoped<IRewardService, RewardService>();

// Note: PostmarkEmailService should already be registered in your existing DI container
```

## 📊 Analytics & Reporting

### Survey Analytics DTO
```csharp
public class SurveyAnalyticsDto
{
    public string SurveyId { get; set; }
    public string Title { get; set; }
    public int TotalResponses { get; set; }
    public int CompletedResponses { get; set; }
    public double CompletionRate { get; set; }
    public int EmailsSent { get; set; }
    public Dictionary<string, object> QuestionAnalytics { get; set; }
    public DateTime FirstResponseAt { get; set; }
    public DateTime LastResponseAt { get; set; }
}
```

## ✅ Implementation Checklist

### Backend Tasks
- [ ] **Database Schema**: Create all required tables with proper indexes
- [ ] **Entity Models**: Implement Survey, SurveyQuestion, SurveyResponse, SurveyAnswer models
- [ ] **Repository Layer**: Implement SurveyRepository with CRUD operations
- [ ] **Service Layer**: Implement SurveyService with business logic
- [ ] **Email Service**: Set up email service (SendGrid/Mailgun integration)
- [ ] **Reward System**: Implement reward code generation and validation
- [ ] **API Controllers**: Create SurveyController with all endpoints
- [ ] **Validation**: Add input validation and business rule validation
- [ ] **Error Handling**: Implement proper error handling and logging
- [ ] **Testing**: Write unit tests for critical functionality

### Configuration Tasks
- [ ] **Email Setup**: Configure email service credentials
- [ ] **Database**: Set up connection strings and run migrations
- [ ] **Logging**: Configure structured logging
- [ ] **Security**: Set up authentication and authorization
- [ ] **CORS**: Configure CORS for frontend domain

### Deployment Tasks
- [ ] **Environment Variables**: Set up production configuration
- [ ] **Database Migration**: Deploy database schema to production
- [ ] **Email Templates**: Deploy and test email templates
- [ ] **Monitoring**: Set up application monitoring and alerts
- [ ] **Load Testing**: Test survey submission under load

## 🎯 Success Metrics

### Technical Metrics
- **Response Time**: < 500ms for survey load, < 2s for submission
- **Availability**: 99.9% uptime for survey endpoints
- **Email Delivery**: > 95% successful email delivery rate
- **Data Integrity**: 100% accurate one-submission validation

### Business Metrics
- **Completion Rate**: Target > 70% survey completion
- **Email Engagement**: Track email open/click rates
- **Reward Redemption**: Track reward code usage
- **User Satisfaction**: Monitor survey feedback quality

---

This comprehensive backend implementation provides a production-ready survey system with email integration, one-submission validation, and analytics capabilities. The system is designed to scale and integrate seamlessly with the existing Chowmate infrastructure.