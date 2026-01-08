/*

plastic (ID: medtop:20000224)
The production of plastics and issues around plastic consumption, including bans, recycling, using less plastics and plastic alternatives

climate change (ID: medtop:20000418)
Significant change in measures of climate (such as temperature, precipitation, or wind) lasting for an extended period

environmental clean-up (ID: medtop:20000426)
Processes whereby contaminated areas are cleaned of hazardous materials so they can be inhabited again by either people or animals.

waste materials (ID: medtop:20000428)
The environmental impact of waste, including recycling efforts

water pollution (ID: medtop:20000429)
Solids or liquids that corrupt the quality of water that could be used for drinking or irrigation

handicrafts (ID: medtop:20001160)
The creators and sellers of crafts and the making and selling of the supplies used to make those crafts


respuesta de la api de apitube
 {
    "status": "ok",
    "page": 1,
    "path": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=2",
    "has_next_pages": true,
    "next_page": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=3",
    "has_previous_page": false,
    "previous_page": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1",
    "export": {
        "json": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1&export=json",
        "xlsx": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1&export=xlsx",
        "csv": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1&export=csv",
        "tsv": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1&export=tsv",
        "xml": "https://api.apitube.io/v1/news/everything?language.code=en&per_page=2&page=1&export=xml"
    },
    "request_id": "5978d89c-46f6-4ab4-b65c-8b4a6000d4ac",
    "results": [
        {
    "id": "Unique article ID",
    "href": "URL of the original article",
    "published_at": "Publication date and time in ISO 8601 format",
    "title": "Article title",
    "description": "Brief article description",
    "body": "Full article text",
    "language": "Article language (ISO 639-1 code)",
    "author": {
        "id": "Author ID",
        "name": "Author name"
    },
    "image": "URL of the main article image",
    "categories": [
        {
            "id": "Category ID",
            "name": "Category name",
            "score": "Category relevance score for the article",
            "taxonomy": "Category taxonomy name",
            "links": {
                "self": "URL to get information about the category"
            }
        }
    ],
    "topics": "Array of topics related to the article",
    "industries": [
        {
            "id": "Industry ID",
            "name": "Industry name",
            "links": {
                "self": "URL to get information about the industry"
            }
        }
    ],
    "entities": [
        {
            "id": "Entity ID",
            "name": "Entity name",
            "links": {
                "self": "URL to get information about the entity",
                "wikipedia": "Link to Wikipedia article",
                "wikidata": "Link to entity in Wikidata"
            },
            "types": "Array of entity types (human, location, organization, etc.)",
            "language": "Entity language",
            "frequency": "Frequency of entity mentions in the article",
            "title": {
                "pos": "Array of entity mention positions in the title"
            },
            "body": {
                "pos": "Array of entity mention positions in the article body"
            }
        }
    ],
    "source": {
        "id": "Source ID",
        "domain": "Source domain",
        "home_page_url": "URL of the source homepage",
        "type": "Source type (news, blog, etc.)",
        "bias": "Source bias",
        "rankings": {
            "opr": "Source ranking"
        },
        "location": {
            "country_name": "Source country name",
            "country_code": "Source country code (ISO 3166-1 alpha-2)"
        },
        "favicon": "Source favicon URL"
    },
    "sentiment": {
        "overall": {
            "score": "Overall article sentiment score",
            "polarity": "Textual representation of sentiment (positive, negative, neutral)"
        },
        "title": {
            "score": "Title sentiment score",
            "polarity": "Textual representation of title sentiment"
        },
        "body": {
            "score": "Article body sentiment score",
            "polarity": "Textual representation of body sentiment"
        }
    },
    "summary": [
        {
            "sentence": "Key sentence from the article",
            "sentiment": {
                "score": "Sentence sentiment score",
                "polarity": "Textual representation of sentiment"
            }
        }
    ],
    "keywords": "Array of article keywords",
    "links": "Array of URLs mentioned in the article",
    "media": [
        {
            "url": "Media file URL",
            "type": "Media file type (image, video, etc.)",
            "format": "Media file format (jpeg, png, mp4, etc.)"
        }
    ],
    "story": {
        "id": "Story ID",
        "uri": "URL to get information about the story"
    },
    "is_duplicate": "Flag indicating if the article is a duplicate",
    "is_paywall": "Flag indicating if the article is behind a paywall",
    "is_breaking": "Flag indicating if the article is breaking news",
    "read_time": "Estimated reading time in minutes",
    "sentences_count": "Number of sentences in the article",
    "paragraphs_count": "Number of paragraphs in the article",
    "words_count": "Number of words in the article",
    "characters_count": "Number of characters in the article"
}
    ]
}
 */