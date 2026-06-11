using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Notification;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Enums;
using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using BC = BCrypt.Net.BCrypt;

namespace FitMoldova.BusinessLogic.Core
{
     public class UserAction
     {
          private readonly FitMoldovaContext _ctx;

          public UserAction(FitMoldovaContext ctx)
          {
               _ctx = ctx;
          }

          public ServiceResponse CheckEmailExecution(string email)
          {
               // 1. Verifică dacă emailul e deja folosit în baza de date
               var taken = _ctx.Users.Any(u => u.Email == email);
               if (taken)
                    return new ServiceResponse { isSuccess = true, Data = new { taken = true, domainValid = true } };

               // 2. Verifică dacă domeniul emailului are înregistrări MX (acceptă email-uri)
               var domainValid = false;
               try
               {
                    var domain = email.Split('@').LastOrDefault();
                    if (!string.IsNullOrEmpty(domain))
                    {
                         var hostEntry = System.Net.Dns.GetHostEntry(domain);
                         domainValid = hostEntry.AddressList.Length > 0;
                    }
               }
               catch
               {
                    // Domeniu inexistent sau DNS indisponibil
                    domainValid = false;
               }

               return new ServiceResponse { isSuccess = true, Data = new { taken = false, domainValid } };
          }

          public ServiceResponse RegisterExecution(UserCreateDto dto)
          {
               if (_ctx.Users.Any(u => u.Email == dto.Email))
                    return new ServiceResponse { isSuccess = false, Message = "Email deja folosit." };

               var localPart = dto.Email.Split('@')[0].ToLower();
               var cleaned = new string(localPart
                    .Where(c => char.IsLetterOrDigit(c) || c == '.' || c == '_' || c == '-')
                    .ToArray());
               var baseUsername = string.IsNullOrEmpty(cleaned) ? "user" : cleaned;
               var username = baseUsername;
               var suffix = 1;
               while (_ctx.Users.Any(u => u.Username == username))
                    username = $"{baseUsername}{suffix++}";

               var user = new UDTable
               {
                    Username  = username,
                    FirstName = dto.FirstName,
                    LastName  = dto.LastName,
                    Email     = dto.Email,
                    Password  = BC.HashPassword(dto.Password),
                    CreatedAt = DateTime.UtcNow,
                    Role      = UserRole.User,

                    // Câmpuri opționale — explicit null/empty pentru user nou
                    Phone             = null,
                    Location          = null,
                    Bio               = null,
                    ProfileImageUrl   = null,
               };
               _ctx.Users.Add(user);
               _ctx.SaveChanges();
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Cont creat.",
                    Data = new UserLoginResultDto
                    {
                         Id           = user.Id,
                         Username     = user.Username,
                         FirstName    = user.FirstName,
                         LastName     = user.LastName,
                         Email        = user.Email,
                         Role         = user.Role.ToString(),
                         RegisteredAt = user.CreatedAt.ToString("o")
                    }
               };
          }

          public ServiceResponse LoginExecution(UserLoginDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Email == dto.Email);
               if (user == null || !BC.Verify(dto.Password, user.Password))
                    return new ServiceResponse { isSuccess = false, Message = "Email sau parolă incorectă." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Login reușit.",
                    Data = new UserLoginResultDto
                    {
                         Id          = user.Id,
                         Username    = user.Username,
                         FirstName   = user.FirstName,
                         LastName    = user.LastName,
                         Email       = user.Email,
                         Role        = user.Role.ToString(),
                         RegisteredAt = user.CreatedAt.ToString("o")
                    }
               };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Userul cu ID {id} nu există." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Data = new { user.Id, user.Username, user.FirstName, user.LastName, user.Email, user.Role, user.CreatedAt }
               };
          }

          public ServiceResponse UpdateExecution(int id, UserUpdateDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.FirstName = dto.FirstName;
               user.LastName = dto.LastName;
               user.Email = dto.Email;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Profil actualizat." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               _ctx.Users.Remove(user);
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Cont șters." };
          }

          public ServiceResponse GetAllExecution()
          {
               var users = _ctx.Users.Select(u => new
               {
                    u.Id,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    Role = u.Role.ToString(),
                    u.IsActive,
                    u.CreatedAt
               }).ToList();
               return new ServiceResponse { isSuccess = true, Data = users };
          }

          public ServiceResponse ChangeRoleExecution(int id, ChangeRoleDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               if (!Enum.TryParse<UserRole>(dto.Role, ignoreCase: true, out var newRole))
                    return new ServiceResponse { isSuccess = false, Message = "Rol invalid." };
               user.Role = newRole;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Rol actualizat." };
          }

          public ServiceResponse ChangeStatusExecution(int id, ChangeStatusDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.IsActive = dto.IsActive;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = dto.IsActive ? "Utilizator reactivat." : "Utilizator blocat." };
          }

          public ServiceResponse GetProfileExecution(int userId)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Data = new
                    {
                         user.Id,
                         user.FirstName,
                         user.LastName,
                         user.Email,
                         user.Phone,
                         user.Location,
                         user.Bio,
                         user.ProfileImageUrl,
                         Role = user.Role.ToString(),
                         user.CreatedAt
                    }
               };
          }

          public ServiceResponse UpdateProfileExecution(int userId, UserUpdateProfileDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               if (dto.Phone != null) user.Phone = dto.Phone;
               if (dto.Location != null) user.Location = dto.Location;
               if (dto.Bio != null) user.Bio = dto.Bio;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Profil actualizat." };
          }

          public ServiceResponse GetCommunityExecution()
          {
               var users = _ctx.Users
                   .Where(u => u.IsActive)
                   .Select(u => new
                   {
                        u.Id,
                        u.Username,
                        u.FirstName,
                        u.LastName,
                        u.ProfileImageUrl,
                        FollowersCount = _ctx.UserFollows.Count(f => f.FollowedId == u.Id)
                   }).ToList();
               return new ServiceResponse { isSuccess = true, Data = users };
          }

          public ServiceResponse FollowExecution(int followerId, int followedId)
          {
               if (followerId == followedId)
                    return new ServiceResponse { isSuccess = false, Message = "Nu te poți urmări pe tine însuți." };
               if (!_ctx.Users.Any(u => u.Id == followedId))
                    return new ServiceResponse { isSuccess = false, Message = "Utilizatorul nu există." };
               if (_ctx.UserFollows.Any(f => f.FollowerId == followerId && f.FollowedId == followedId))
                    return new ServiceResponse { isSuccess = false, Message = "Deja urmărești acest utilizator." };

               _ctx.UserFollows.Add(new UserFollowEntity { FollowerId = followerId, FollowedId = followedId });

               var follower = _ctx.Users.FirstOrDefault(u => u.Id == followerId);
               var followerName = follower != null
                    ? $"{follower.FirstName} {follower.LastName}".Trim()
                    : "Cineva";

               _ctx.Notifications.Add(new NotificationEntity
               {
                    UserId     = followedId,
                    FromUserId = followerId,
                    Type       = "follow",
                    Content    = $"{followerName} te urmărește acum",
                    IsRead     = false,
                    CreatedAt  = DateTime.UtcNow,
               });

               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Urmărești acum acest utilizator." };
          }

          public ServiceResponse UnfollowExecution(int followerId, int followedId)
          {
               var follow = _ctx.UserFollows.FirstOrDefault(f => f.FollowerId == followerId && f.FollowedId == followedId);
               if (follow == null)
                    return new ServiceResponse { isSuccess = false, Message = "Nu urmărești acest utilizator." };
               _ctx.UserFollows.Remove(follow);
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Nu mai urmărești acest utilizator." };
          }

          public ServiceResponse GetFollowingExecution(int userId)
          {
               var following = _ctx.UserFollows
                    .Where(f => f.FollowerId == userId)
                    .Select(f => new
                    {
                         f.Followed.Id,
                         f.Followed.Username,
                         f.Followed.FirstName,
                         f.Followed.LastName,
                         f.Followed.ProfileImageUrl,
                         f.Followed.Location,
                         f.Followed.Bio,
                         f.Followed.CreatedAt,
                         FollowedAt = f.FollowedAt
                    })
                    .ToList();
               return new ServiceResponse { isSuccess = true, Data = following };
          }

          public ServiceResponse ChangePasswordExecution(int userId, ChangePasswordDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Utilizatorul nu a fost găsit." };

               if (!BC.Verify(dto.CurrentPassword, user.Password))
                    return new ServiceResponse { isSuccess = false, Message = "Parola curentă este incorectă." };

               var hasLetter  = dto.NewPassword.Any(char.IsLetter);
               var hasDigit   = dto.NewPassword.Any(char.IsDigit);
               var hasSpecial = dto.NewPassword.Any(c => !char.IsLetterOrDigit(c));
               if (dto.NewPassword.Length < 8 || !hasLetter || !hasDigit || !hasSpecial)
                    return new ServiceResponse
                    {
                         isSuccess = false,
                         Message = "Parola nouă trebuie să conțină cel puțin 8 caractere, o literă, o cifră și un caracter special."
                    };

               user.Password = BC.HashPassword(dto.NewPassword);
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Parola a fost schimbată cu succes." };
          }

          // ── Upload avatar ──────────────────────────────────────────────────────

          private static readonly HashSet<string> AllowedAvatarExtensions =
               new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

          public ServiceResponse UploadAvatarExecution(int userId, IFormFile file, string webRootPath)
          {
               const long maxSize = 5 * 1024 * 1024;

               if (file == null || file.Length == 0)
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul lipsește." };
               if (file.Length > maxSize)
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul depășește limita de 5 MB." };

               var ext = Path.GetExtension(file.FileName);
               if (string.IsNullOrEmpty(ext) || !AllowedAvatarExtensions.Contains(ext))
                    return new ServiceResponse { isSuccess = false, Message = "Extensie nepermisă. Acceptate: .jpg, .jpeg, .png, .webp." };

               var avatarsDir = Path.Combine(webRootPath, "uploads", "avatars");
               Directory.CreateDirectory(avatarsDir);

               var guid = Guid.NewGuid().ToString("N");
               var fileName = $"{guid}.webp";
               var filePath = Path.Combine(avatarsDir, fileName);

               try
               {
                    using var stream = file.OpenReadStream();
                    using var image = Image.Load(stream);
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                         Size = new Size(300, 300),
                         Mode = ResizeMode.Crop
                    }));
                    image.Save(filePath, new WebpEncoder { Quality = 82 });
               }
               catch (UnknownImageFormatException)
               {
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul nu este o imagine validă." };
               }
               catch (Exception ex)
               {
                    if (File.Exists(filePath)) File.Delete(filePath);
                    return new ServiceResponse { isSuccess = false, Message = $"Eroare la procesarea imaginii: {ex.Message}" };
               }

               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
               {
                    if (File.Exists(filePath)) File.Delete(filePath);
                    return new ServiceResponse { isSuccess = false, Message = "Utilizatorul nu a fost găsit." };
               }

               var imageUrl = $"/uploads/avatars/{fileName}";
               user.ProfileImageUrl = imageUrl;
               _ctx.SaveChanges();

               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Avatar actualizat cu succes.",
                    Data = new { imageUrl }
               };
          }
     }
}