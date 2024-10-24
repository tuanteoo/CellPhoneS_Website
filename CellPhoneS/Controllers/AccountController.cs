using MegaNews.Data;
using MegaNews.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MegaNews.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private PasswordHasher<AccountModel> _passwordHasher;

        private const string Session_Cookie_Email = "Email";
        private const string Session_Cookie_UserName = "UserName";


        public AccountController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _passwordHasher = new PasswordHasher<AccountModel>();
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignUp([FromBody] AccountModel accountModel)
        {
            var account = await _dbContext.tblAccount
                        .FirstOrDefaultAsync(a => a.Email == accountModel.Email);

            if (account == null)
            {
                accountModel.Password = _passwordHasher.HashPassword(accountModel, accountModel.Password);

                _dbContext.tblAccount.Add(accountModel);
                await _dbContext.SaveChangesAsync();
                return Json(new { success = true });
            }
            else
            {
                return Json(new { success = false, message = "Email has been used to register another account" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignIn([FromBody] SignInModel signInModel)
        {
            var account = await _dbContext.tblAccount
                .FirstOrDefaultAsync(a => a.Email == signInModel.Email);

            if (account != null)
            {
                var result = _passwordHasher.VerifyHashedPassword(account, account.Password, signInModel.Password);

                if (result == PasswordVerificationResult.Success)
                {
                    if (account.Role == "User")
                    {
                        HttpContext.Session.SetString(Session_Cookie_Email, account.Email);
                        HttpContext.Session.SetString(Session_Cookie_UserName, account.UserName);
                        return Json(new { success = true, redirectUrl = Url.Action("Index", "Home") });
                    }
                    else
                    {
                        return Json(new { success = true, redirectUrl = Url.Action("Index", "Admin") });
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Incorrect password account information" });
                }
            }
            else
            {
                return Json(new { success = false, message = "Account doesn't exist" });
            }
        }
    }
}
