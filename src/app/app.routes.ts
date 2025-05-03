import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoComponent } from './el-camino/el-camino.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: LandingComponent },
            { path: 'f', component: FactoryComponent },
            { path: 'p', component: ElCaminoComponent }
        ]
    }
];
