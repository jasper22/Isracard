import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, map} from 'rxjs/operators';
import { GithubResult } from './github-result';


@Injectable({
  providedIn: 'root'
})
export class SearchGithubService {

  baseUrl: string = 'https://api.github.com/search/repositories';
  pageData: string = "?per_page=30&page="
  queryUrl: string = '&q=';

  constructor(private http: HttpClient) { }

  // search(terms: Observable<string>, pageIndex: number) {
  //   return terms.pipe(
  //                     debounceTime(400),
  //                     distinctUntilChanged(),
  //                     switchMap(term => this.searchEntries(term, pageIndex)));
  // }

  search(term, pageIndex: number): Observable<GithubResult> {
    return this.http
        .get(this.baseUrl + this.pageData + pageIndex + this.queryUrl + term)
        .pipe(map(res => <GithubResult> res ));
  }
}
