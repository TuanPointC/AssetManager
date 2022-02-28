using AssetManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Context
{
    public class AssetManagementContext : DbContext
    {
        public AssetManagementContext() { }
        public AssetManagementContext(DbContextOptions<AssetManagementContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.FirstName).HasMaxLength(255);
                entity.Property(p => p.LastName).HasMaxLength(255);
                entity.Property(p => p.Type).HasMaxLength(20);
                entity.Property(p => p.Location).HasMaxLength(20);
                entity.Property(p => p.UserName).HasMaxLength(255);
                entity.Property(p => p.StaffCode).HasMaxLength(20);
                entity.Property(p => p.Gender).HasMaxLength(6);
                entity.Property(p => p.DateOfBirth).HasColumnType("datetime2");
                entity.Property(p => p.JoinedDate).HasColumnType("datetime2");
            });
            
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasMany(p => p.Assets).WithOne(p => p.Category).HasForeignKey(p => p.CategoryId);
                entity.HasIndex(p => p.Prefix);
                entity.HasIndex(p => p.Name);
            });

            modelBuilder.Entity<Asset>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.HasOne(p => p.Category)
                    .WithMany(p => p.Assets)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.NoAction);
                entity.Property(p => p.InstalledDate).HasColumnType("datetime2");
            });

            modelBuilder.Entity<Assignment>(entity =>
            {
                entity.HasKey(p => p.AssignmentId);
                entity.HasOne(p=>p.User).WithMany().OnDelete(DeleteBehavior.NoAction).HasForeignKey(k=>k.AssignToId);
                entity.HasOne(p=>p.Admin).WithMany().OnDelete(DeleteBehavior.NoAction).HasForeignKey(k=>k.AssignById);
                entity.HasOne(p=>p.Asset).WithMany().OnDelete(DeleteBehavior.NoAction).HasForeignKey(k=>k.AssetId);
            });

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<RequestReturn> RequestReturns { get; set; }
    }
}
