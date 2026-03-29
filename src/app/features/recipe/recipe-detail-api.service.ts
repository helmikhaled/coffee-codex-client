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
    const encodedId = encodeURIComponent(id);
    return this.httpClient.get<RecipeDetailDto>(`${this.recipesEndpoint}/${encodedId}`);
  }
}
