import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetailDto } from '../../contracts/recipe-detail.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipeDetailApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  getRecipeById(id: string): Observable<RecipeDetailDto> {
    return this.httpClient.get<RecipeDetailDto>(this.getRecipeUrl(id));
  }

  recordRecipeView(id: string): Observable<void> {
    return this.httpClient.post<void>(`${this.getRecipeUrl(id)}/view`, null);
  }

  private getRecipeUrl(id: string): string {
    const encodedId = encodeURIComponent(id);
    return `${this.recipesEndpoint}/${encodedId}`;
  }
}
