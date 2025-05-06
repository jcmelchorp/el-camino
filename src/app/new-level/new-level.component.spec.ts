import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewLevelComponent } from './new-level.component';

describe('LevelsComponent', () => {
  let component: NewLevelComponent;
  let fixture: ComponentFixture<NewLevelComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
