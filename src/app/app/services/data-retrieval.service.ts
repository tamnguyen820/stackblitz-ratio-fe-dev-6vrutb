import { Injectable } from '@angular/core';
import { data } from '../data/data';

@Injectable({ providedIn: 'root' })
export class DataRetrievalService {
  constructor() {}
  public retrieveGeoJSON() {
    return data;
  }
}
