export class APITubeNewsResponse {
  status: string;
  page: number;
  path: string;
  has_next_pages: boolean;
  next_page: string;
  has_previous_page: boolean;
  previous_page: string;
  export: {
    json: string;
    xlsx: string;
    csv: string;
    tsv: string;
    xml: string;
  };
  request_id: string;
  results: APITubeNewsArticle[];
}

export class APITubeNewsArticle {
  id: string;
  href: string;
  published_at: string;
  title: string;
  description: string;
  body: string;
  language: string;
  author: {
    id: string;
    name: string;
  };
  image: string;
  categories: {
    id: string;
    name: string;
    score: string;
    taxonomy: string;
    links: {
      self: string;
    };
  }[];
  topics: string[]; 
  industries: {
    id: string;
    name: string;
    links: {
      self: string;
    };
  }[];
  entities: {
    id: string;
    name: string;
    links: {
      self: string;
      wikipedia: string;
      wikidata: string;
    };
    types: string[];
    language: string;
    frequency: string;
    title: {
      pos: string[];
    };
    body: {
      pos: string[];
    };
  }[];
  source: {
    id: string;
    domain: string;
    home_page_url: string;
    type: string;
    bias: string;
    rankings: {
      opr: string;
    };
    location: {
      country_name: string;
      country_code: string;
    };
    favicon: string;
  };
  sentiment: {
    overall: {
      score: string;
      polarity: string;
    };
    title: {
      score: string;
      polarity: string;
    };
    body: {
      score: string;
      polarity: string;
    };
  };
  summary: {
    sentence: string;
    sentiment: {
      score: string;
      polarity: string;
    };
  }[];
  keywords: string[];
  links: string[];
  media: {
    url: string;
    type: string;
    format: string;
  }[];
  story: {
    id: string;
    uri: string;
  };
  is_duplicate: boolean;
  is_paywall: boolean;
  is_breaking: boolean;
  read_time: string;
  sentences_count: number;
  paragraphs_count: number;
  words_count: number;
  characters_count: number;
}
