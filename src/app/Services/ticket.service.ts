import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse, SaveTicket, Ticket } from '../models/models';



@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http : HttpClient) { }

  baseUrl = "http://localhost:5227/api/";

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl+'Ticket/get-tickets');
  }


  addTicket(ticket: SaveTicket): Observable<GeneralResponse> {
    return this.http.post<GeneralResponse>(`${this.baseUrl}Ticket/add-ticket`, ticket);
}
}
