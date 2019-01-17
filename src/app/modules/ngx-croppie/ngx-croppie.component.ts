import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions, CropData } from 'croppie';

export type Type = 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-croppie',
  template: `<div #imageEdit (update)="newResult()"></div>`
})
export class NgxCroppieComponent implements OnInit, OnChanges {
  @ViewChild('imageEdit') imageEdit: ElementRef;
  @Input() croppieOptions: CroppieOptions;
  @Input() imageUrl: string;
  @Input() points: number[];
  @Input() imgChangeNo: number;

  @Input() outputFormatOptions: ResultOptions = { type: 'base64', size: 'viewport' };
  @Output() result: EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement>
    = new EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement>();
  private _croppie: Croppie;

  constructor() {
  }

  ngOnInit(): void {
    // https://github.com/Foliotek/Croppie/issues/470 :-( )
    this._croppie = new Croppie['Croppie'](this.imageEdit.nativeElement, this.croppieOptions);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.imgChangeNo) {
      setTimeout(() => {
        this._croppie.bind({
          url: changes.imageUrl.currentValue,
          orientation: 1
        });
      });
    }
  }

  newResult() {
    this._croppie.result(this.outputFormatOptions).then((res) => {
      this.result.emit(res);
    });
  }

  rotate(degrees: 90 | 180 | 270 | -90 | -180 | -270) {
    this._croppie.rotate(degrees);
  }

  get(): CropData {
    return this._croppie.get();
  }

}
