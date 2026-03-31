using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    [DbContext(typeof(FitMoldovaContext))]
    [Migration("20260329020130_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
        }
    }
}