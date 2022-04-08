import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  public setCookie(cookieName: string, cookieVal: string, expirationDays: number) {
    let expirationDate: Date = new Date(Date.now() + (expirationDays * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + "=" + cookieVal + "; expires=" + expirationDate.toUTCString() + "; path=/";
  }

  public getCookie(cookieName: string) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(cookieName + "=");
        if (c_start != -1) {
            c_start = c_start + cookieName.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURIComponent(document.cookie.substring(c_start, c_end));
        }
    }
    return undefined;
  }
  
  public deleteCookie(cookieName: string) {
    // Set expiration date to a day ago
    this.setCookie(cookieName, '', -1);
  }
}
