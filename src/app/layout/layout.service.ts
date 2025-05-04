import { computed, Injectable, signal } from "@angular/core";

export interface AppTheme {
    name: 'light' | 'dark' | 'system',
    icon: string
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
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
        this.appTheme.set(theme);
    }

    selectedTheme = computed(() => {
        return this.themes.find(theme => theme.name === this.appTheme())
    })
}
