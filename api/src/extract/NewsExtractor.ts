import { Article } from '@model/Article';
import HttpClient from './HttpClient';
import dotenv from 'dotenv';

interface NewsApiResponse {
  _type: string,
  didUMean: string,
  totalCount: number,
  relatedSearch: string[],
  value: Article[]
}

export default class NewsExtractor extends HttpClient {
  private static instance: NewsExtractor;
  private static url = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI'; 
  private static energyTopics = [
    'Energy',
    /*'Renewable Energy',
    'Non Renewable Energy',
    'Fossil fuels',
    'Solar energy',
    'Hydrogen energy',
    'Wind energy',
    'Natural Gas',
    'Nuclear energy',
    'Coal',
    'Geothermal',
    'Biomass',
    'Hydro Energy'*/
  ];

  private constructor() {
    super(NewsExtractor.url, {
      'x-rapidapi-key': process.env.NEWS_API_KEY,
      'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
    });
  }

  public static getInstance(): NewsExtractor {
    if (!NewsExtractor.instance) {
      NewsExtractor.instance = new NewsExtractor();
    }        

    return NewsExtractor.instance;
  };

  public async getAll() {    
    NewsExtractor.energyTopics.forEach(async (topic: string) => {            
      const news = await super.get<NewsApiResponse>({
        params: {
          q: topic,
          pageNumber: '1',
          pageSize: '1',
          autoCorrect: 'true',
          fromPublishedDate: 'null',
          toPublishedDate: 'null',
        }
      });

      news.value.forEach(async (article) => this.processArticle(article));
    });  
  }

  private async processArticle(article: Article) {
    console.log(article);
  }
}

dotenv.config();
if (!process.env.NEWS_API_KEY) {
  throw new Error('NEWS_API_KEY must be defined');
}

(async () => {  
  try {
    await NewsExtractor.getInstance().getAll();
  } catch (error) {
    console.log(error);
  }
})();