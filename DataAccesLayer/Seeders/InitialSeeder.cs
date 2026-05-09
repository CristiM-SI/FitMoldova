using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Entities.Event;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Enums;
using BC = BCrypt.Net.BCrypt;

namespace FitMoldova.DataAccesLayer.Seeders;

public static class InitialSeeder
{
    public static void Seed(FitMoldovaContext context)
    {
        var admin = SeedAdmin(context);
        var users = SeedDemoUsers(context);
        SeedClubs(context);
        SeedEvents(context);
        SeedChallenges(context);
        SeedActivities(context, admin, users);
        SeedFollows(context, users);
    }

    // ── Admin ──────────────────────────────────────────────────────────────────

    private static UDTable SeedAdmin(FitMoldovaContext ctx)
    {
        var admin = new UDTable
        {
            Username  = "admin.fitmoldova",
            FirstName = "Admin",
            LastName  = "FitMoldova",
            Email     = "admin@fitmoldova.md",
            Password  = BC.HashPassword("Admin@FitMoldova2026!"),
            Role      = UserRole.Admin,
            IsActive  = true,
            CreatedAt = DateTime.UtcNow,
        };
        ctx.Users.Add(admin);
        ctx.SaveChanges();
        return admin;
    }

    // ── Demo users ─────────────────────────────────────────────────────────────

    private static List<UDTable> SeedDemoUsers(FitMoldovaContext ctx)
    {
        var data = new[]
        {
            // credențialele specificate în cerință
            ("Ion",      "Popescu",   "demo@fitmoldova.md",     "demotry123456!@#$", "Chișinău",  "Pasionat de alergare și ciclism."),
            ("Maria",    "Ionescu",   "maria@fitmoldova.md",    "Password123!",      "Bălți",     "Yoga și nutriție sportivă."),
            ("Alexandru","Cojocaru",  "alex@fitmoldova.md",     "Password123!",      "Cahul",     "Antrenamente de forță și crossfit."),
            ("Elena",    "Rusu",      "elena@fitmoldova.md",    "Password123!",      "Orhei",     "Înot și sporturi de apă."),
            ("Andrei",   "Munteanu",  "andrei@fitmoldova.md",   "Password123!",      "Chișinău",  "Ciclist amator, maraton 2025."),
            ("Cristina", "Botnaru",   "cristina@fitmoldova.md", "Password123!",      "Soroca",    "Fitness și dans sportiv."),
            ("Vasile",   "Danu",      "vasile@fitmoldova.md",   "Password123!",      "Ungheni",   "Fotbal și alergare în aer liber."),
            ("Natalia",  "Gherghel",  "natalia@fitmoldova.md",  "Password123!",      "Edineț",    "Pilates, yoga, recuperare activă."),
        };

        var users = new List<UDTable>();
        foreach (var (first, last, email, pass, city, bio) in data)
        {
            var baseUsername = $"{first.ToLower()}.{last.ToLower()}";
            var username = baseUsername;
            var suffix = 1;
            while (ctx.Users.Any(u => u.Username == username))
                username = $"{baseUsername}{suffix++}";

            var user = new UDTable
            {
                Username  = username,
                FirstName = first,
                LastName  = last,
                Email     = email,
                Password  = BC.HashPassword(pass),
                Role      = UserRole.User,
                IsActive  = true,
                Location  = city,
                Bio       = bio,
                CreatedAt = DateTime.UtcNow.AddDays(-new Random().Next(1, 90)),
            };
            ctx.Users.Add(user);
            users.Add(user);
        }
        ctx.SaveChanges();
        return users;
    }

    // ── Clubs ──────────────────────────────────────────────────────────────────

    private static void SeedClubs(FitMoldovaContext ctx)
    {
        ctx.Clubs.AddRange(
            new ClubEntity
            {
                Name        = "FitLife Chișinău",
                Category    = "Fitness",
                Location    = "str. București 68, Chișinău",
                Description = "Club modern de fitness cu echipamente de ultimă generație și antrenori certificați.",
                Schedule    = "Lun–Vin 07:00–22:00, Sâm–Dum 09:00–20:00",
                Level       = "Toate nivelurile",
                Rating      = 4.8,
                ImageUrl    = "",
            },
            new ClubEntity
            {
                Name        = "Running Moldova",
                Category    = "Alergare",
                Location    = "Parcul Dendrarium, Chișinău",
                Description = "Comunitate de alergători pentru toți nivelurile. Antrenamente de grup în aer liber.",
                Schedule    = "Mar, Joi 18:30 | Sâm 08:00",
                Level       = "Începător–Avansat",
                Rating      = 4.6,
                ImageUrl    = "",
            },
            new ClubEntity
            {
                Name        = "Yoga & Mindfulness",
                Category    = "Yoga",
                Location    = "str. Armenească 33, Chișinău",
                Description = "Studio de yoga Hatha, Vinyasa și meditație pentru echilibru minte-corp.",
                Schedule    = "Zilnic 07:00–21:00",
                Level       = "Toate nivelurile",
                Rating      = 4.9,
                ImageUrl    = "",
            },
            new ClubEntity
            {
                Name        = "Cycling Chișinău",
                Category    = "Ciclism",
                Location    = "bd. Renașterii 12, Chișinău",
                Description = "Cicliști pasionați — ture săptămânale pe trasee din Moldova și România.",
                Schedule    = "Sâm–Dum 07:30",
                Level       = "Intermediar–Avansat",
                Rating      = 4.5,
                ImageUrl    = "",
            },
            new ClubEntity
            {
                Name        = "Swim Team Moldova",
                Category    = "Înot",
                Location    = "Complexul Aquatic Arena, Chișinău",
                Description = "Antrenamente de înot pentru competiție și fitness, toate vârstele.",
                Schedule    = "Lun–Sâm 06:00–09:00 | 18:00–21:00",
                Level       = "Toate nivelurile",
                Rating      = 4.7,
                ImageUrl    = "",
            }
        );
        ctx.SaveChanges();
    }

    // ── Events ─────────────────────────────────────────────────────────────────

    private static void SeedEvents(FitMoldovaContext ctx)
    {
        ctx.Events.AddRange(
            new EventEntity
            {
                Name            = "Maratonul Chișinău 2026",
                Description     = "Ediția a XIV-a a maratonului internațional. Distanțe: 5K, 10K, 21K, 42K.",
                Date            = new DateTime(2026, 9, 20, 8, 0, 0, DateTimeKind.Utc),
                Location        = "Piața Marii Adunări Naționale",
                City            = "Chișinău",
                Category        = "Alergare",
                Participants    = 0,
                MaxParticipants = 3000,
                Price           = "150 MDL",
                Organizer       = "Athletics Moldova",
                Difficulty      = "Mediu",
                ImageUrl        = "",
            },
            new EventEntity
            {
                Name            = "Cupa Moldova la Ciclism",
                Description     = "Cursă pe circuit urban — 60 km prin centrul Chișinăului și împrejurimi.",
                Date            = new DateTime(2026, 8, 15, 9, 0, 0, DateTimeKind.Utc),
                Location        = "Parcul Valea Morilor",
                City            = "Chișinău",
                Category        = "Ciclism",
                Participants    = 0,
                MaxParticipants = 500,
                Price           = "200 MDL",
                Organizer       = "Cycling Moldova",
                Difficulty      = "Avansat",
                ImageUrl        = "",
            },
            new EventEntity
            {
                Name            = "Fitness Open Moldova",
                Description     = "Competiție de fitness și crossfit deschisă pentru amatori și profesioniști.",
                Date            = new DateTime(2026, 10, 5, 10, 0, 0, DateTimeKind.Utc),
                Location        = "Sala Polivalentă",
                City            = "Chișinău",
                Category        = "Fitness",
                Participants    = 0,
                MaxParticipants = 200,
                Price           = "100 MDL",
                Organizer       = "FitMoldova",
                Difficulty      = "Mediu",
                ImageUrl        = "",
            },
            new EventEntity
            {
                Name            = "Triathlon Orhei",
                Description     = "Triathlon sprint: 750m înot, 20km bicicletă, 5km alergare.",
                Date            = new DateTime(2026, 7, 26, 7, 30, 0, DateTimeKind.Utc),
                Location        = "Lacul Orhei",
                City            = "Orhei",
                Category        = "Triathlon",
                Participants    = 0,
                MaxParticipants = 150,
                Price           = "300 MDL",
                Organizer       = "Triathlon Moldova",
                Difficulty      = "Avansat",
                ImageUrl        = "",
            },
            new EventEntity
            {
                Name            = "Festival de Yoga Chișinău",
                Description     = "Zi de yoga cu instructori internaționali — sesiuni în aer liber în parcul central.",
                Date            = new DateTime(2026, 6, 21, 9, 0, 0, DateTimeKind.Utc),
                Location        = "Parcul Ștefan cel Mare",
                City            = "Chișinău",
                Category        = "Yoga",
                Participants    = 0,
                MaxParticipants = 500,
                Price           = "Gratuit",
                Organizer       = "Yoga Moldova",
                Difficulty      = "Ușor",
                ImageUrl        = "",
            }
        );
        ctx.SaveChanges();
    }

    // ── Challenges ─────────────────────────────────────────────────────────────

    private static void SeedChallenges(FitMoldovaContext ctx)
    {
        ctx.Challenges.AddRange(
            new ChallengeEntity
            {
                Name         = "30 de zile de alergare",
                Description  = "Aleargă cel puțin 3 km în fiecare zi timp de 30 de zile consecutive.",
                Duration     = "30 zile",
                Difficulty   = "Mediu",
                Participants = 0,
            },
            new ChallengeEntity
            {
                Name         = "100 flotări pe zi",
                Description  = "Efectuează 100 de flotări zilnic timp de 3 săptămâni. Poți împărți în seturi.",
                Duration     = "21 zile",
                Difficulty   = "Avansat",
                Participants = 0,
            },
            new ChallengeEntity
            {
                Name         = "Yoga pentru Începători",
                Description  = "Sesiune de yoga de 20 de minute în fiecare dimineață, 14 zile la rând.",
                Duration     = "14 zile",
                Difficulty   = "Ușor",
                Participants = 0,
            },
            new ChallengeEntity
            {
                Name         = "5000 km pe bicicletă",
                Description  = "Acumulează 5000 km pedalați pe tot parcursul anului 2026.",
                Duration     = "365 zile",
                Difficulty   = "Avansat",
                Participants = 0,
            },
            new ChallengeEntity
            {
                Name         = "Înot zilnic 30 min",
                Description  = "Înoată minimum 30 de minute pe zi timp de 28 de zile.",
                Duration     = "28 zile",
                Difficulty   = "Mediu",
                Participants = 0,
            }
        );
        ctx.SaveChanges();
    }

    // ── Activities ─────────────────────────────────────────────────────────────

    private static void SeedActivities(FitMoldovaContext ctx, UDTable admin, List<UDTable> users)
    {
        var all = new List<UDTable> { admin }.Concat(users).ToList();
        var rnd = new Random(42);

        var templates = new[]
        {
            ("Alergare matinală",  "Alergare",  "5 km",  "28 min", 310),
            ("Tur cu bicicleta",   "Ciclism",   "22 km", "65 min", 520),
            ("Sesiune yoga",       "Yoga",      "—",     "45 min", 180),
            ("Antrenament forță",  "Fitness",   "—",     "60 min", 400),
            ("Înot",               "Înot",      "1.5 km","40 min", 350),
            ("Trail running",      "Alergare",  "10 km", "58 min", 620),
            ("HIIT",               "Fitness",   "—",     "30 min", 380),
        };

        foreach (var user in all)
        {
            var count = rnd.Next(2, 4);
            for (var i = 0; i < count; i++)
            {
                var t = templates[rnd.Next(templates.Length)];
                ctx.Activities.Add(new ActivityEntity
                {
                    UserId      = user.Id,
                    Name        = t.Item1,
                    Type        = t.Item2,
                    Distance    = t.Item3,
                    Duration    = t.Item4,
                    Calories    = t.Item5 + rnd.Next(-30, 50),
                    Date        = DateTime.UtcNow.AddDays(-rnd.Next(1, 60)),
                    Description = $"Activitate adăugată de {user.FirstName} {user.LastName}.",
                    ImageUrl    = "",
                    CreatedAt   = DateTime.UtcNow,
                });
            }
        }
        ctx.SaveChanges();
    }

    // ── Follows ────────────────────────────────────────────────────────────────

    private static void SeedFollows(FitMoldovaContext ctx, List<UDTable> users)
    {
        if (users.Count < 2) return;

        // Perechi fixe: (followerIndex, followedIndex) — zero-based
        var pairs = new[]
        {
            (0, 1), (0, 2), (0, 3),
            (1, 0), (1, 2),
            (2, 0), (2, 3), (2, 4),
            (3, 1), (3, 4),
            (4, 0), (4, 5),
            (5, 0), (5, 1), (5, 6),
            (6, 2), (6, 7),
            (7, 0), (7, 3),
        };

        foreach (var (fi, di) in pairs)
        {
            if (fi >= users.Count || di >= users.Count) continue;
            ctx.UserFollows.Add(new UserFollowEntity
            {
                FollowerId = users[fi].Id,
                FollowedId = users[di].Id,
                FollowedAt = DateTime.UtcNow.AddDays(-new Random().Next(1, 30)),
            });
        }
        ctx.SaveChanges();
    }
}
