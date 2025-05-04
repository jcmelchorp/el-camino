import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoComponent } from './el-camino/el-camino.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: ElCaminoComponent },
            { path: 'f', component: FactoryComponent },
        ]
    }
];
