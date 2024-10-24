using System.ComponentModel.DataAnnotations;

namespace MegaNews.Models
{
    public class AccountModel
    {
        [Key]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string UserName { get; set; }
        
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        [Required]
        public required string Role { get; set; }
    }
}
