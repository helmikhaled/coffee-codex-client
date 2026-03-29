import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-app-header',
  imports: [RouterLink, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-header.html',
})
export class AppHeader {}
