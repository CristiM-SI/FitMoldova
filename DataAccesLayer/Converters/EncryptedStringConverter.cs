using FitMoldova.BusinessLogic.Core;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FitMoldova.DataAccesLayer.Converters
{
     /// <summary>
     /// ValueConverter care cuplează un IEncryptionService la EF Core.
     ///
     /// EF îl apelează AUTOMAT:
     ///   - la SaveChanges()  → Encrypt(plaintext) → scrie ciphertext Base64 în coloana Postgres
     ///   - la citire din DB  → Decrypt(ciphertext) → returnează plaintext în entitate
     ///
     /// Codul din BusinessLogic nu se schimbă cu nimic — UserAction continuă să
     /// acceseze user.Phone / user.Location / user.Bio ca string-uri normale.
     ///
     /// LIMITĂRI:
     ///   - NU poți face `WHERE Phone = '+37369...'` direct în query (coloana e ciphertext).
     ///     Pentru căutare pe câmp criptat ar trebui criptare deterministică SAU HMAC index,
     ///     ceea ce depășește scopul acestui proiect.
     ///   - Lungimea coloanei creștere ~40-50% față de plaintext din cauza Base64 + nonce + tag.
     ///     De asta atributele [StringLength(20/100/500)] pe UDTable sunt prea mici pentru
     ///     coloanele criptate — trebuie mărite în migrare (vezi pasul 4).
     /// </summary>
     public class EncryptedStringConverter : ValueConverter<string?, string?>
     {
          public EncryptedStringConverter(IEncryptionService encryption)
               : base(
                    plaintext => encryption.Encrypt(plaintext),
                    ciphertext => encryption.Decrypt(ciphertext))
          {
          }
     }
}
