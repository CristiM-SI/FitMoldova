using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace FitMoldova.BusinessLogic.Core
{
     /// <summary>
     /// Implementare AES-256-GCM pentru criptarea câmpurilor sensibile din DB.
     ///
     /// Cheia (32 bytes) este citită din secțiunea "Encryption:Key" a configurației,
     /// codată Base64. Se poate genera o cheie nouă cu:
     ///     dotnet run -- --generate-key
     /// sau în PowerShell:
     ///     [Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))
     ///
     /// IMPORTANT: cheia NU se păstrează în appsettings.json comis în Git.
     /// Local: dotnet user-secrets
     /// Producție: variabilă de mediu FITMOLDOVA__ENCRYPTION__KEY
     /// </summary>
     public class AesGcmEncryptionService : IEncryptionService
     {
          private const int NonceSize = 12;   // 96-bit — recomandat de NIST pentru GCM
          private const int TagSize = 16;     // 128-bit — authentication tag
          private const int KeySize = 32;     // 256-bit

          private readonly byte[] _key;

          public AesGcmEncryptionService(IConfiguration configuration)
          {
               var keyBase64 = configuration["Encryption:Key"]
                    ?? throw new InvalidOperationException(
                         "Lipsește 'Encryption:Key' din configurație. " +
                         "Setează cu: dotnet user-secrets set \"Encryption:Key\" \"<base64-32-bytes>\"");

               _key = Convert.FromBase64String(keyBase64);

               if (_key.Length != KeySize)
                    throw new InvalidOperationException(
                         $"Cheia de criptare trebuie să aibă exact {KeySize} bytes ({KeySize * 8} biți). " +
                         $"Cheia furnizată are {_key.Length} bytes.");
          }

          public string? Encrypt(string? plaintext)
          {
               if (plaintext is null) return null;
               if (plaintext.Length == 0) return string.Empty;

               var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);

               // Nonce random pentru fiecare criptare — CRITIC pentru securitatea GCM.
               // Reutilizarea nonce-ului cu aceeași cheie COMPROMITE confidențialitatea.
               var nonce = RandomNumberGenerator.GetBytes(NonceSize);

               var ciphertext = new byte[plaintextBytes.Length];
               var tag = new byte[TagSize];

               using var aesGcm = new AesGcm(_key, TagSize);
               aesGcm.Encrypt(nonce, plaintextBytes, ciphertext, tag);

               // Concatenare: [nonce | ciphertext | tag] → Base64
               var output = new byte[NonceSize + ciphertext.Length + TagSize];
               Buffer.BlockCopy(nonce, 0, output, 0, NonceSize);
               Buffer.BlockCopy(ciphertext, 0, output, NonceSize, ciphertext.Length);
               Buffer.BlockCopy(tag, 0, output, NonceSize + ciphertext.Length, TagSize);

               return Convert.ToBase64String(output);
          }

          public string? Decrypt(string? ciphertext)
          {
               if (ciphertext is null) return null;
               if (ciphertext.Length == 0) return string.Empty;

               byte[] input;
               try
               {
                    input = Convert.FromBase64String(ciphertext);
               }
               catch (FormatException)
               {
                    // Date ne-criptate rămase din versiuni anterioare — le returnăm ca atare.
                    // Util când migrezi de la DB ne-criptat la criptat fără să pierzi date.
                    return ciphertext;
               }

               if (input.Length < NonceSize + TagSize)
                    throw new CryptographicException(
                         "Ciphertext invalid: lungime mai mică decât nonce + tag.");

               var nonce = new byte[NonceSize];
               var tag = new byte[TagSize];
               var cipherBytes = new byte[input.Length - NonceSize - TagSize];

               Buffer.BlockCopy(input, 0, nonce, 0, NonceSize);
               Buffer.BlockCopy(input, NonceSize, cipherBytes, 0, cipherBytes.Length);
               Buffer.BlockCopy(input, NonceSize + cipherBytes.Length, tag, 0, TagSize);

               var plaintextBytes = new byte[cipherBytes.Length];

               using var aesGcm = new AesGcm(_key, TagSize);
               // Aruncă CryptographicException dacă tag-ul nu validează
               // (adică cineva a modificat ciphertext-ul sau cheia e greșită).
               aesGcm.Decrypt(nonce, cipherBytes, tag, plaintextBytes);

               return Encoding.UTF8.GetString(plaintextBytes);
          }
     }
}
