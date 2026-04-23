using System.Text.Json;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Feedback;
using FitMoldova.Domain.Models.Feedback;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
    public class FeedbackAction
    {
        private readonly DbSession _dbSession = new DbSession();

        /// Salvează o recenzie nouă trimisă de utilizator.
        public ServiceResponse SubmitExecution(FeedbackCreateDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return new ServiceResponse { isSuccess = false, Message = "Rating-ul trebuie să fie între 1 și 5." };
            if (string.IsNullOrWhiteSpace(dto.Title))
                return new ServiceResponse { isSuccess = false, Message = "Titlul este obligatoriu." };
            if (string.IsNullOrWhiteSpace(dto.Message) || dto.Message.Trim().Length < 20)
                return new ServiceResponse { isSuccess = false, Message = "Mesajul trebuie să aibă cel puțin 20 de caractere." };

            using var ctx = _dbSession.FitMoldovaContext();
            var entity = new FeedbackEntity
            {
                UserId         = dto.UserId,
                Rating         = dto.Rating,
                Title          = dto.Title.Trim(),
                Message        = dto.Message.Trim(),
                CategoriesJson = JsonSerializer.Serialize(dto.Categories ?? new List<string>()),
                Status         = "vizibil",
                IsPinned       = false,
                CreatedAt      = DateTime.UtcNow,
            };
            ctx.Feedbacks.Add(entity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Data = entity.Id };
        }

        /// Returnează recenziile vizibile, pinned-urile primele, restul descrescător după dată.
        public ServiceResponse GetAllExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var list = ctx.Feedbacks
                .Where(f => f.Status == "vizibil")
                .OrderByDescending(f => f.IsPinned)
                .ThenByDescending(f => f.CreatedAt)
                .ToList()
                .Select(f => new FeedbackInfoDto
                {
                    Id         = f.Id,
                    UserId     = f.UserId,
                    Rating     = f.Rating,
                    Title      = f.Title,
                    Message    = f.Message,
                    Categories = JsonSerializer.Deserialize<List<string>>(f.CategoriesJson) ?? new List<string>(),
                    Status     = f.Status,
                    IsPinned   = f.IsPinned,
                    CreatedAt  = f.CreatedAt,
                })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = list };
        }

        /// Returnează toate recenziile (inclusiv ascunse) — doar admin.
        public ServiceResponse GetAllAdminExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var list = ctx.Feedbacks
                .OrderByDescending(f => f.IsPinned)
                .ThenByDescending(f => f.CreatedAt)
                .ToList()
                .Select(f => new FeedbackInfoDto
                {
                    Id         = f.Id,
                    UserId     = f.UserId,
                    Rating     = f.Rating,
                    Title      = f.Title,
                    Message    = f.Message,
                    Categories = JsonSerializer.Deserialize<List<string>>(f.CategoriesJson) ?? new List<string>(),
                    Status     = f.Status,
                    IsPinned   = f.IsPinned,
                    CreatedAt  = f.CreatedAt,
                })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = list };
        }

        /// Returnează statistici globale: rating mediu, total, satisfacție, distribuție.
        public ServiceResponse GetStatsExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var all = ctx.Feedbacks.Where(f => f.Status == "vizibil").ToList();

            if (!all.Any())
            {
                return new ServiceResponse
                {
                    isSuccess = true,
                    Data = new FeedbackStatsDto
                    {
                        AverageRating   = 0,
                        TotalCount      = 0,
                        SatisfactionPct = 0,
                        Distribution    = new List<FeedbackStarDistribution>()
                    }
                };
            }

            var total          = all.Count;
            var averageRating  = Math.Round(all.Average(f => f.Rating), 1);
            var satisfiedCount = all.Count(f => f.Rating >= 4);
            var satisfactionPct = (int)Math.Round((double)satisfiedCount / total * 100);

            var distribution = new List<FeedbackStarDistribution>();
            for (int star = 5; star >= 1; star--)
            {
                var count = all.Count(f => f.Rating == star);
                distribution.Add(new FeedbackStarDistribution
                {
                    Star  = star,
                    Count = count,
                    Pct   = (int)Math.Round((double)count / total * 100)
                });
            }

            return new ServiceResponse
            {
                isSuccess = true,
                Data = new FeedbackStatsDto
                {
                    AverageRating   = averageRating,
                    TotalCount      = total,
                    SatisfactionPct = satisfactionPct,
                    Distribution    = distribution
                }
            };
        }

        /// Schimbă vizibilitatea unei recenzii (vizibil / ascuns) — doar admin.
        public ServiceResponse UpdateStatusExecution(int id, string status)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = $"Recenzia cu ID {id} nu există." };
            entity.Status = status;
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Status actualizat." };
        }

        /// Comută starea pinned a unei recenzii — doar admin.
        public ServiceResponse TogglePinExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = $"Recenzia cu ID {id} nu există." };
            entity.IsPinned = !entity.IsPinned;
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = entity.IsPinned ? "Recenzia a fost pinsată." : "Recenzia a fost despinsă." };
        }

        /// Șterge definitiv o recenzie — doar admin.
        public ServiceResponse DeleteExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Feedbacks.FirstOrDefault(f => f.Id == id);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = $"Recenzia cu ID {id} nu există." };
            ctx.Feedbacks.Remove(entity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Recenzie ștearsă." };
        }
    }
}
