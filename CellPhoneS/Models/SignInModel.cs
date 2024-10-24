using System.ComponentModel.DataAnnotations;

namespace MegaNews.Models
{
    public class SignInModel
    {
        [Required]
        public required string Email { get; set; }


        [Required]
        public required string Password { get; set; }
    }
}
