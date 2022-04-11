import { iLanguage } from './iLanguage';

export class Portuguese implements iLanguage {
    public clear: string = "(P) Clear";
    public word: string = "(P) Word";
    public score: string = "(P) Score";
    public putWordsHere: string = "(P) Put words here";
    public exText: string = "(P) Ex. Quoted";
    public mustBeZero: string = "(P) Score must be 0 to share!";
    public lookupsNotSupported: string = "(P) Lookups and definitions not supported for non-English languages.";

    // Help page
    public goal: string = "(P) Reach today's target by forming an English sentence!";
    public scoring: string = "(P) Scoring";
    public alphaVal: string = "(P) Each letter has a value based on its sequence in the alphabet.";
    public vowels: string = "(P) Vowels* have negative values.";
    public yException: string = "(P) *Y is always counted as a consanant";
    public example: string = "(P) Example";

    // Singleton stuff
    private static _instance: Portuguese;
    private constructor() { }
    public static get Instance(): Portuguese
    {
        return this._instance || (this._instance = new this());
    }
}