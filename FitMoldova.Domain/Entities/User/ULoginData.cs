using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitMoldova.Domain.Entities.User
{
     public class ULoginData
     {
          public  required string Credential { get; set; }
          public required string Password { get; set; }
          public required string LoginIp { get; set; }
          public DateTime LoginDateTime { get; set; }
     }
}
