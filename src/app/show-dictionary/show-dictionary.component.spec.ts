import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDictionaryComponent } from './show-dictionary.component';

describe('ShowDictionaryComponent', () => {
  let component: ShowDictionaryComponent;
  let fixture: ComponentFixture<ShowDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
