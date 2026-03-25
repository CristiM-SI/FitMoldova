using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FitMoldova.DataAccesLayer;

namespace FitMoldova.DataAccesLayer
{
     public class DbSession
     {
          public FitMoldovaContext FitMoldovaContext()
          {
               return new FitMoldovaContext();
          }
     }
}
