import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeListQueryDto } from '../../contracts/recipe-list-query.dto';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipeListApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  getRecipes(query: RecipeListQueryDto): Observable<PagedResponseDto<RecipeSummaryDto>> {
    const params = new HttpParams({
      fromObject: {
        page: String(query.page),
        pageSize: String(query.pageSize),
      },
    });

    return this.httpClient.get<PagedResponseDto<RecipeSummaryDto>>(this.recipesEndpoint, { params });
  }

  getFirstPage(pageSize: number): Observable<PagedResponseDto<RecipeSummaryDto>> {
    return this.getRecipes({ page: 1, pageSize });
  }

  getNextPage(currentPage: number, pageSize: number): Observable<PagedResponseDto<RecipeSummaryDto>> {
    return this.getRecipes({ page: currentPage + 1, pageSize });
  }
}
