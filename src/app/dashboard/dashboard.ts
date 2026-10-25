import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpotifySearch } from '../services/spotify-search';
import { SessionStorageService } from '../services/session-storage';
@Component({
  imports: [RouterLink,CommonModule,FormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  isMenuOpen = false;
  private searchService = inject(SpotifySearch);
  private sessionStorage = inject(SessionStorageService);

 private router = inject(Router);
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }



loginRegister(modo:string){
  console.log(modo);
    this.router.navigate(["/login"]);
  }

  terminoBusqueda = '';

buscar(): void {
  const termino = this.terminoBusqueda.trim();

  if (!termino) return;

  this.searchService.buscar(termino);
  this.router.navigate(['/home']);
}

 
}
