export interface CountryResponse {
  name: string;
  flags: { svg: string };
  capital?: string;
  region: string;
  population: number;
  languages: CountryLanguage[];
  area: number;
  borders?: string[];
  currencies?: CountryCurrency[];
}

export interface CountryLanguage {
  name: string;
}

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  readonly name: string;
  flagUrl: string;
  capital: string | null;
  region: string;
  population: number;
  readonly languages: string[];
}
