using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitMoldova.Domain.Models.Services
{
     public class ServiceResponse
     {
          public bool isSuccess { get; set; }
          public string? Message { get; set; }
          public object? Data { get; set; }
     }
}
