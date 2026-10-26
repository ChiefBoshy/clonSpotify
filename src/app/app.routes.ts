import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TrackDetail } from './components/track-detail/track-detail';
import { AesEjemplo } from './pages/aes-ejemplo/aes-ejemplo';

export const routes: Routes = [
    {path:'home',component:Home},
    {path:'login',component:Login},
    {path:'tracks/:id',component:TrackDetail},
    {path:'aes',component:AesEjemplo},
    {path:'',redirectTo:'/home',pathMatch:'full'}
];
