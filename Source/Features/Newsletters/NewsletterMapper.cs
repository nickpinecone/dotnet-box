using News.Features.Newsletters.Commands;
using News.Infrastructure.Extensions;
using News.Models;
using Riok.Mapperly.Abstractions;

namespace News.Features.Newsletters;

[Mapper]
public partial class NewsletterMapper : IMapper
{
    public partial CreateNewsletter.Response Map(Newsletter newsletter);
}
