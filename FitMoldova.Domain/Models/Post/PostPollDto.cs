namespace FitMoldova.Domain.Models.Post
{
     // Forma de citire a sondajului, aliniată cu ForumThread.poll din frontend:
     // options[{ text, votes }], totalVotes, voted (dacă userul curent a votat).
     public class PostPollDto
     {
          public int Id { get; set; }
          public string? Question { get; set; }
          public List<PostPollOptionDto> Options { get; set; } = new();
          public int TotalVotes { get; set; }
          public bool Voted { get; set; }
     }

     public class PostPollOptionDto
     {
          public int Id { get; set; }
          public string Text { get; set; } = string.Empty;
          public int Votes { get; set; }
     }
}
