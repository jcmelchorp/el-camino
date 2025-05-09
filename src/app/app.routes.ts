import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoComponent } from './el-camino/el-camino.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewLevelComponent } from './new-level/new-level.component';
import { LevelsComponent } from './levels/levels.component';
import { BoardComponent } from './board/board.component';
import { PlayComponent } from './play/play.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: ElCaminoComponent },
            { path: 'l', component: FactoryComponent },
            { path: 'f', component: LevelsComponent },
            { path:'b', component: BoardComponent },
            {  path :'play',component:PlayComponent}
        ]
    },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
];
