import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoFlipComponent } from './el-camino-flip/el-camino-flip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewLevelComponent } from './new-level/new-level.component';
import { LevelsComponent } from './levels/levels.component';
import { BoardComponent } from './board/board.component';
import { MazeComponent } from './maze/maze.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: ElCaminoFlipComponent },
            { path: 'f', component: FactoryComponent },
            { path: 'l', component: LevelsComponent },
            { path:'m',component:MazeComponent}
        ]
    },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
];
