import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  styleUrl: './layout.component.css',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    TitleCasePipe
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav no-copy" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="false">
        <mat-toolbar class="flex flex-row justify-center items-center"> 
        <img class="rounded-full w-10 h-10" src="icons/apple-icon-57x57.png"/>
          <button mat-button type="button" [routerLink]="['/']">
          <span class="font-semibold text-2xl">El Camino</span>
          </button>
        </mat-toolbar>
        <mat-nav-list>
        <a mat-list-item (click)="drawer.close()" routerLink="/">
          <mat-icon matListItemIcon>gamepad</mat-icon> 
         <div matListItemTitle> Play</div>
</a>
        <a mat-list-item (click)="drawer.close()" routerLink="/f">
          <mat-icon matListItemIcon>factory</mat-icon> 
         <div matListItemTitle> Factory</div>
</a>
<!-- <a mat-list-item routerLink="/a">
          <mat-icon matListItemIcon>info</mat-icon> 
         <div matListItemTitle> About</div>
</a> -->
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar >
          <div class="w-full flex flex-row justify-between items-center">
<div class="flex flex-row items-center">
<button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()">
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>
            <img class="rounded-full w-10 h-10" src="icons/apple-icon-57x57.png"/>

 <button *ngIf="(isHandset$ | async) || !drawer.opened" mat-button type="button"
            [routerLink]="['/']"><span class="font-semibold text-2xl">El Camino</span></button>
</div>
<div>
<button mat-icon-button [mat-menu-trigger-for]="themeMenu">
            <mat-icon>{{_layoutService.selectedTheme()?.icon}}</mat-icon>
        </button>
        <mat-menu #themeMenu="matMenu">
          @for (theme of _layoutService.getThemes()  ; track theme.name) {
            <button mat-menu-item (click)="_layoutService.setTheme(theme.name)">
            <mat-icon>{{theme.icon}}</mat-icon>
              <span>{{theme.name|titlecase}}</span>
            </button>
          }
        </mat-menu>
        <button mat-icon-button
        (click)="toggleFullscreen()">
            <mat-icon>fullscreen</mat-icon>
        </button>
</div>
          </div>
      
        </mat-toolbar>
        <!-- Add Content Here -->
     <div class="main-content no-copy"><router-outlet /></div> 
      <footer class="no-copy flex flex-row justify-between items-center">
  <div class="pl-5 overflow-hidden"> 2025 &copy; Pete Sahatt</div>
  <div class="pr-5 overflow-hidden">
    <a  mat-icon-button href="https://github.com/jcmelchorp/" target="_blank" aria-hidden="false">
    <i class="pi pi-github"></i>
    </a>
    <a mat-icon-button href="https://www.instagram.com/pete.sahatt/" target="_blank" aria-hidden="false">
<i class="pi pi-instagram"></i>
  </a>
    <a  mat-icon-button href="https://x.com/pete_sahatt/" target="_blank" aria-hidden="false">
     <i class="pi pi-twitter"></i>
    </a>
  </div>
</footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
    
  `,
})
export class LayoutComponent {
  _layoutService = inject(LayoutService);
  private breakpointObserver = inject(BreakpointObserver);
  element: HTMLBodyElement | null = null;

  constructor() {
    this.element = document.querySelector('body');

  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    enterFullscreen(element: HTMLElement): Promise<void> {
      if (element.requestFullscreen) {
          return element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
          return (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
          return (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
          return (element as any).msRequestFullscreen();
      } else {
          return Promise.reject(new Error('Fullscreen API is not supported.'));
      }
  }
    exitFullscreen(): Promise<void> {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            return (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            return (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
            return (document as any).msExitFullscreen();
        } else {
            return Promise.reject(new Error('Fullscreen API is not supported.'));
        }
    }
    toggleFullscreen() {
      if (this.element) {
        if (!document.fullscreenElement) {
          this.enterFullscreen(this.element)
            .then(() => console.log('Fullscreen on'))
            .catch((error) => console.error('Error toggling fullscreen:', error));
        } else {
          this.exitFullscreen()
          .then(() => console.log('Fullscreen off'))
          .catch((error) => console.error('Error toggling fullscreen:', error));
        }
      }
    }
}
