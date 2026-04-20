namespace FitMoldova.BusinessLogic.Core
{
     /// <summary>
     /// Serviciu de criptare simetrică pentru câmpuri sensibile din DB.
     /// Folosit de ValueConverter-ii din FitMoldovaContext pentru a cripta/decripta
     /// transparent datele la save/read din PostgreSQL (Supabase).
     ///
     /// Algoritm: AES-256-GCM (authenticated encryption)
     ///   - 256-bit key (32 bytes) din configurație
     ///   - 96-bit nonce (12 bytes) generat random pentru fiecare operație
     ///   - 128-bit tag de autentificare (16 bytes) — detectează modificarea ciphertext-ului
     ///
     /// Format stocat în DB (Base64 decodat):
     ///   [ 12 bytes nonce ][ N bytes ciphertext ][ 16 bytes auth tag ]
     ///
     /// În DB apare ca string Base64, ex: "k7fH2Jq8aPzYmN1vBxRtLQ=="
     /// </summary>
     public interface IEncryptionService
     {
          /// <summary>Criptează un string în clar. Returnează null dacă input-ul e null.</summary>
          string? Encrypt(string? plaintext);

          /// <summary>Decriptează un string criptat. Returnează null dacă input-ul e null.</summary>
          /// <exception cref="System.Security.Cryptography.CryptographicException">
          /// Aruncată dacă ciphertext-ul a fost modificat sau cheia e greșită.
          /// </exception>
          string? Decrypt(string? ciphertext);
     }
}
