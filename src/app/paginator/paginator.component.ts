import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit {
  @Input() paginador: any;
  paginas: number[];

  constructor() { }

  ngOnInit(): void {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
  }

  /*@Input('paginador')
  public set items(items: any) {
    this.paginador = items;
    if(this.paginador){
      this.nPage = this.paginador.totalPages;
      this.paginas = new Array(this.nPage).fill(0).map((_valor, indice) => indice + 1);
    }
  }*/
}
