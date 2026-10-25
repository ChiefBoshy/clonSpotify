import { Service } from '@angular/core';
import { Subject } from 'rxjs';

@Service()
export class SpotifySearch {

    private searchSubject = new Subject<string>();

    search$ = this.searchSubject.asObservable();

    buscar(termino: string): void {
        this.searchSubject.next(termino);
    }
}
