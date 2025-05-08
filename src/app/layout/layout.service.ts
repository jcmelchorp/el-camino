import { DOCUMENT } from "@angular/common";
import { computed, inject, Injectable, signal } from "@angular/core";

export interface AppTheme {
    name: 'light' | 'dark' | 'system',
    icon: string
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private document = inject(DOCUMENT);

    appTheme = signal<'light' | 'dark' | 'system'>('system');

    themes: AppTheme[] = [
        { name: 'light', icon: 'light_mode' },
        { name: 'dark', icon: 'dark_mode' },
        { name: 'system', icon: 'settings_brightness' }
    ];
    
    getThemes() {
        return this.themes;
    }

    setTheme(theme: 'light' | 'dark' | 'system') {
        this.document.body.classList.toggle(theme);
        this.appTheme.set(theme);
    }

    selectedTheme = computed(() => {
        return this.themes.find(theme => theme.name === this.appTheme())
    })

    toggleDarkTheme() {
        this.document.body.classList.toggle('dark');
        this.appTheme.update(theme => theme === 'dark' ? 'light' : 'dark');
    }
}
