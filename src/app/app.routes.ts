import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FactoryComponent } from './factory/factory.component';
import { ElCaminoFlipComponent } from './el-camino-flip/el-camino-flip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewLevelComponent } from './new-level/new-level.component';
import { LevelsComponent } from './levels/levels.component';
import { BoardComponent } from './board/board.component';
import { MazeComponent } from './maze/maze.component';
import { ElCaminoFlipFactoryComponent } from './el-camino-flip/el-camino-flip-factory.component';
import { SpaceInvadersComponent } from './space-invaders/space-invaders.component';
import { CatchTheCatComponent } from './catch-the-cat/catch-the-cat.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', component: ElCaminoFlipComponent },
            { path: 'factory',component:ElCaminoFlipFactoryComponent},
            { path:'maze',component:MazeComponent},
            { path:'space-invaders',component:SpaceInvadersComponent},
            { path:'catch-the-cat',component:CatchTheCatComponent}
        ]
    },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
];
