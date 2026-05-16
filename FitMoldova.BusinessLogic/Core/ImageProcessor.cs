using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace FitMoldova.BusinessLogic.Core
{
     internal static class ImageProcessor
     {
          private const int ThumbnailSize = 300;
          private const int MaxOriginalWidth = 1920;
          private const int WebpQuality = 82;

          /// <summary>
          /// Procesează imaginea și returnează două stream-uri WebP: original + thumbnail.
          /// Caller-ul e responsabil să Dispose() stream-urile după folosire.
          /// </summary>
          public static (MemoryStream webp, MemoryStream thumb, int width, int height)
               Process(Stream inputStream)
          {
               using var image = Image.Load<Rgba32>(inputStream);

               var width = image.Width;
               var height = image.Height;

               if (width > MaxOriginalWidth)
               {
                    var ratio = (double)MaxOriginalWidth / width;
                    image.Mutate(x => x.Resize(MaxOriginalWidth, (int)(height * ratio)));
                    width = MaxOriginalWidth;
                    height = image.Height;
               }

               // Original → WebP
               var webpStream = new MemoryStream();
               image.Save(webpStream, new WebpEncoder { Quality = WebpQuality });
               webpStream.Position = 0;

               // Thumbnail 300×300 crop centrat
               var thumbStream = new MemoryStream();
               using var thumb = image.Clone(ctx => ctx.Resize(new ResizeOptions
               {
                    Size = new Size(ThumbnailSize, ThumbnailSize),
                    Mode = ResizeMode.Crop
               }));
               thumb.Save(thumbStream, new WebpEncoder { Quality = WebpQuality });
               thumbStream.Position = 0;

               return (webpStream, thumbStream, width, height);
          }
     }
}