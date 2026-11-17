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
  readonly flagUrl: string;
  readonly capital: string | null;
  readonly region: string;
  readonly population: number;
  readonly languages: readonly string[];
  readonly area: number;
  readonly borders: readonly string[];
  readonly currencies: readonly string[];
}
