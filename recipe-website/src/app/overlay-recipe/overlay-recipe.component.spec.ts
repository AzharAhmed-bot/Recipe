import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayRecipeComponent } from './overlay-recipe.component';

describe('OverlayRecipeComponent', () => {
  let component: OverlayRecipeComponent;
  let fixture: ComponentFixture<OverlayRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverlayRecipeComponent]
    });
    fixture = TestBed.createComponent(OverlayRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
