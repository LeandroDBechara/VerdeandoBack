import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { APITubeNewsResponse, APITubeNewsArticle } from './dto/news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { GetNewsParamsDto } from './dto/get-news-params.dto';
import { NewsletterService } from '../newsletter/newsletter.service';
//no muestra el enlace de la noticia ni las imagenes si no pagas
@Injectable()
export class NewsServiceOld {
  private readonly logger = new Logger(NewsServiceOld.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.apitube.io/v1/news/everything';

  constructor(private configService: ConfigService, private newsletterService: NewsletterService) {
    const apiKey = this.configService.get<string>('APITUBE_KEY');
    if (!apiKey) {
      throw new Error('APITUBE_KEY is not configured in environment variables');
    }
    this.apiKey = apiKey;
  }

  async getNews(params?: GetNewsParamsDto): Promise<NewsResponseDto[]> {
    try {
      this.logger.log('Fetching news from APITube...');

      const queryParams: Record<string, string> = {
        api_key: this.apiKey,
        "page": "1",
        "page_size": "10",
        "category.id": "medtop:20000224,medtop:20000426,medtop:20000428,medtop:20000429,medtop:20001160",//plastico,Limpieza ambiental, materiales de desecho, contaminación del agua, artesanías.
        "language.code": "es",
        "location.name": "Tucumán,Argentina",
        "sort_by": "published_at",
        "sort_order": "desc",
        "sentiment.overall.polarity": "positive",
        //"published_at.start": `${new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()}`,//30 days ago
        //"is_paywall": "1",
        //"is_duplicate": "1" no anda
      };

      const response = await axios.get<APITubeNewsResponse>(this.apiUrl, {
        params: queryParams,
      });

      if (!response.data || !response.data.results) {
        throw new Error('APITube returned invalid response');
      }

      // Transform APITube articles to match required format
      const noticias: NewsResponseDto[] = response.data.results.map((article) =>
        this.transformArticle(article),
      );

      this.logger.log(`Successfully fetched ${noticias.length} news articles`);
      return noticias;
    } catch (error) {
      this.logger.error('Error fetching news from APITube', error.stack);
      throw error;
    }
  }

  private transformArticle(article: APITubeNewsArticle): NewsResponseDto {
    // Extract tag from categories or topics
    const tag =
      article.categories && article.categories.length > 0
        ? article.categories[0].name
        : article.topics && article.topics.length > 0
          ? article.topics[0]
          : 'General';

    // Calculate relevancia based on sentiment score if available
    const relevancia = article.sentiment?.overall?.score
      ? parseFloat(article.sentiment.overall.score)
      : 0;
      
    return {
      id: article.id,
      titulo: article.title || 'Sin título',
      descripcion: article.description || 'Sin descripción',
      image: article.image || 'https://via.placeholder.com/400x300?text=No+Image',
      url: article.href || '',
      tag: tag,
      fechaCreacion: new Date(article.published_at),
      views: 0, // APITube no proporciona views directamente
      relevancia: relevancia,
    };
  }
}
