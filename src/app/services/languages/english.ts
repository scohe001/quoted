import { iLanguage } from './iLanguage';

export class English implements iLanguage {
    public clear: string = "Clear";
    public word: string = "Word";
    public score: string = "Score";
    public putWordsHere: string = "Put words here";
    public exText: string = "Ex. Quoted";
    public mustBeZero: string = "Score must be 0 to share!";
    public lookupsNotSupported: string = "Lookups and definitions not supported for non-English languages.";

    // Help page
    public goal: string = "Reach today's target by forming an English sentence!";
    public scoring: string = "Scoring";
    public alphaVal: string = "Each letter has a value based on its sequence in the alphabet.";
    public vowels: string = "Vowels* have negative values.";
    public yException: string = "*Y is always counted as a consanant";
    public example: string = "Example";

    // Singleton stuff
    private static _instance: English;
    private constructor() { }
    public static get Instance(): English
    {
        return this._instance || (this._instance = new this());
    }
}