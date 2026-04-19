using AutoMapper;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Club;

namespace FitMoldova.BusinessLogic.Mappings
{
    /// <summary>
    /// Profil central AutoMapper pentru FitMoldova.
    /// Definește toate conversiile DTO ↔ Entity folosite de BusinessLogic.
    ///
    /// Filosofie:
    ///   - AutoMapper pentru CREATE și UPDATE (logica de scriere) — elimină codul repetitiv,
    ///     punct unic de modificare când schimbăm schema.
    ///   - NU folosim AutoMapper pentru GET (citirea listelor) — acolo păstrăm proiecțiile
    ///     LINQ .Select() pentru că EF Core le traduce în SQL eficient cu doar coloanele
    ///     necesare, iar AutoMapper ar rupe optimizarea (ar cere încărcarea entității întregi).
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ── ACTIVITATE ────────────────────────────────────────────────

            // DTO de create → Entity nouă
            // Ignorăm câmpurile setate server-side (Id auto-generat, CreatedAt = UtcNow,
            // User-ul rezolvat din UserId de business logic, colecția Participants).
            CreateMap<ActivityCreateDto, ActivityEntity>()
                .ForMember(dest => dest.Id,           opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt,    opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.User,         opt => opt.Ignore())
                .ForMember(dest => dest.Participants, opt => opt.Ignore());

            // DTO de update → Entity existentă (aplicată prin _mapper.Map(dto, entity))
            // Ignorăm Id, UserId (nu se schimbă creatorul), CreatedAt (se păstrează originalul),
            // User și Participants (navigation properties tracked de EF).
            CreateMap<ActivityUpdateDto, ActivityEntity>()
                .ForMember(dest => dest.Id,           opt => opt.Ignore())
                .ForMember(dest => dest.UserId,       opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt,    opt => opt.Ignore())
                .ForMember(dest => dest.User,         opt => opt.Ignore())
                .ForMember(dest => dest.Participants, opt => opt.Ignore());


            // ── CLUB ──────────────────────────────────────────────────────

            CreateMap<ClubCreateDto, ClubEntity>()
                .ForMember(dest => dest.Id,      opt => opt.Ignore())
                .ForMember(dest => dest.Rating,  opt => opt.MapFrom(_ => 0.0))
                .ForMember(dest => dest.Members, opt => opt.Ignore());

            CreateMap<ClubUpdateDto, ClubEntity>()
                .ForMember(dest => dest.Id,      opt => opt.Ignore())
                .ForMember(dest => dest.Members, opt => opt.Ignore());
        }
    }
}
