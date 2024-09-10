import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRecipesComponent } from './detailed-recipes.component';

describe('DetailedRecipesComponent', () => {
  let component: DetailedRecipesComponent;
  let fixture: ComponentFixture<DetailedRecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedRecipesComponent]
    });
    fixture = TestBed.createComponent(DetailedRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
