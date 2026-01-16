import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface ArticuloDto {
  id: string;
  titulo: string;
  descripcion: string;
  image: string;
  url: string;
  tag: string;
  fechaCreacion: Date;
  views: number;
}

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);
  private readonly newsApiKey: string;
  private readonly newsApiUrl = 'https://newsapi.org/v2/everything';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');
    if (!apiKey) {
      throw new Error('NEWS_API_KEY is not configured in environment variables');
    }
    this.newsApiKey = apiKey;
  }

  public async getArticulos(): Promise<ArticuloDto[]> {
    try {
      this.logger.log('Fetching articles from NewsAPI...');
      
      const params = {
        apiKey: this.newsApiKey,
        q: '(medio AND ambiente) OR medioambiente OR reciclaje OR reciclar OR manualidades OR manualidad NOT(cambio AND climatico)',
        pageSize: 5,
        domains: 'lagaceta.com.ar,lanacion.com.ar,infobae.com,pagina12.com.ar,clarin.com',
        sortBy: 'publishedAt',
        language: 'es',
        from: `${new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()}`,//60 days ago
      };

      const response = await axios.get<NewsApiResponse>(this.newsApiUrl, { params });

      if (response.data.status !== 'ok') {
        throw new Error('NewsAPI returned error status');
      }

      // Transform NewsAPI articles to match frontend expectations
      const articulos: ArticuloDto[] = response.data.articles.map((article, index) => ({
        id: `${Date.now()}-${index}`,
        titulo: article.title || 'Sin título',
        descripcion: article.description || 'Sin descripción',
        image: article.urlToImage || 'https://via.placeholder.com/400x300?text=No+Image',
        url: article.url,
        tag: this.extractTag(article.source.name),
        fechaCreacion: new Date(article.publishedAt),
        views: 0
      }));

      this.logger.log(`Successfully fetched ${articulos.length} articles`);
      return articulos;
    } catch (error) {
      this.logger.error('Error fetching articles from NewsAPI', error.stack);
      throw error;
    }
  }

  private extractTag(sourceName: string): string {
    // Extract tag from source name
    const tagMap: { [key: string]: string } = {
      'La Nacion': 'Noticias',
      'Infobae': 'Actualidad',
      'La Gaceta': 'Regional',
    };

    return tagMap[sourceName] || 'General';
  }
}

