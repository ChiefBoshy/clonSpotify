import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { pageAnimation } from './animations/pageAnimation';
@Component({
  imports: [RouterOutlet,Dashboard],
  selector: 'app-root',
  styleUrl: './app.scss',
    animations:[pageAnimation],

  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('proyecto');
    routeState = '';

}
