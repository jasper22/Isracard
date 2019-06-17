import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, ReplaySubject, merge, Observable, of, BehaviorSubject, fromEvent } from 'rxjs';

import { SearchGithubService } from '../search-github.service';
import { GithubResult } from '../github-result';
import { MatTable, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { startWith, switchMap, map, catchError, debounceTime, concatMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { GithubResultItem } from '../github-result-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {

  targetName = new FormControl('', Validators.required);
  displayedColumns: string[] = ['number', 'fullname', 'description', 'home', 'created', 'language'];

  results: BehaviorSubject<GithubResultItem[]> = new BehaviorSubject<GithubResultItem[]>([]);
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  pageIndex = 0;

  @ViewChild(MatTable, {static: false}) dataTable: MatTable<GithubResult>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;

  constructor(private searchService: SearchGithubService) {
  }

  ngAfterViewInit() : void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.paginator.page.subscribe(x => this.pageIndex = x.pageIndex);

    this.results.subscribe(x => this.dataTable.renderRows());

    fromEvent(this.searchInput.nativeElement,'keyup')
    .pipe(
        tap(() => this.isLoadingResults = true),
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0;
            this.LoadData();
        })
    )
    .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.LoadData())
      ).subscribe();
  }

  LoadData() {
    const term = this.searchInput.nativeElement.value;

    this.isLoadingResults = true;
    this.isRateLimitReached = false;

    this.searchService.search(term, this.paginator.pageIndex)
                      .pipe(catchError(err => {
                        this.isRateLimitReached = true;
                        return of({items: [], total_count: 0});
                      }))
                      .subscribe(data => {
                        this.isLoadingResults = false;
                        this.resultsLength = data.total_count;
                        this.results.next(data.items);
                      });
  }

}
