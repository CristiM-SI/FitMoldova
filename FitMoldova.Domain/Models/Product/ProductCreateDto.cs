using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitMoldova.Domain.Models.Product
{
     public class ProductCreateDto
     {
          public required string Name {  get; set; }

          public decimal Price { get; set; }

     }
}
