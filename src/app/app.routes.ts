import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoComponent } from './el-camino/el-camino.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewLevelComponent } from './new-level/new-level.component';
import { LevelsComponent } from './levels/levels.component';
import { BoardComponent } from './board/board.component';
import { BoardContainerComponent } from './board-container/board-container.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: ElCaminoComponent },
            { path: 'f', component: FactoryComponent },
            { path: 'l', component: LevelsComponent },
            { path:'b', component: BoardContainerComponent }
        ]
    },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: '' }
];
