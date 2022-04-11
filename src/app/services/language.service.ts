import { EventEmitter, Injectable } from '@angular/core';

// Languages
import { iLanguage } from './languages/iLanguage';
import { English } from './languages/english';
import { Portuguese } from './languages/portuguese';

export enum Language {
  English,
  Portuguese
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Cosntants
  static readonly defaultLang: Language = Language.English;
  static readonly langOptions: Map<Language, iLanguage> = new Map([
    [Language.English, English.Instance],
    [Language.Portuguese, Portuguese.Instance],
  ]);

  // Members
  public selectedLang: Language = LanguageService.defaultLang;
  // To let everyone know to recalc bindings. Looks like it may not be needed
  public languageChangedEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  public get Language(): iLanguage {
    // If selectedLang lookup fails, fallback to default
    return LanguageService.langOptions.get(this.selectedLang) ?? this.DefaultLanguage;
  }

  public get DefaultLanguage(): iLanguage {
    // If defaultLang SOMEHOW fails, just fallback to English
    return LanguageService.langOptions.get(LanguageService.defaultLang) ?? English.Instance;
  }

  public setLanguage(lang: Language): void {
    this.selectedLang = lang;
    // Let everyone know to recalc all bindings
    this.languageChangedEmitter.emit();
  }
}
