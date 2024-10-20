import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TicketService } from '../Services/ticket.service';
import { GeneralResponse, SaveTicket, Ticket } from '../models/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private ticketService : TicketService , private modalService : NgbModal) { }

  tickets : Ticket[] = [];

  page: number = 1; 
  pageSize: number = 4; 
  collectionSize: number = 0; 
  pagedTickets: Ticket[] = []; 
  isUpdate: boolean = false;
  selectedTicket: SaveTicket | null = null;

  @ViewChild('ticketModal') ticketModal!: TemplateRef<any>;

  ngOnInit(): void {
    this.loadTickets();
	 //  collectionSize = tickets.length;
	  // tickets0 = this.tickets[];

   //  refreshCountries() {
   //   this.tickets = Ticket.map((ticket, i) => ({ id: i + 1, ...ticket })).slice(
    //    (this.page - 1) * this.pageSize,
    //    (this.page - 1) * this.pageSize + this.pageSize,
    //  );
   // }
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        console.log(this.tickets);
      },
      (error) => {
        console.error('Error fetching tickets', error);
      }
    );
  }

  openAddTicketModal(): void {
    this.isUpdate = false;
    this.selectedTicket = { id: 0, description: '', status: 0 };
    this.modalService.open(this.ticketModal);
  }

  openUpdateTicketModal(ticket: Ticket): void {
    this.isUpdate = true;
    const statusNumber = ticket.status === 'Open' ? 0 : 1;
  
    this.selectedTicket = {
      id: ticket.id,
      description: ticket.description,
      status: statusNumber,
    };

    console.log(this.selectedTicket);
  
    this.modalService.open(this.ticketModal);
  }


  addTicket(): void {
    if (this.selectedTicket) {
        this.ticketService.addTicket(this.selectedTicket).subscribe(
            (response: GeneralResponse) => {
                if (response.flag) {
                  alert(response.message);
                    this.loadTickets(); 
                } else {
                    alert(response.message);
                }
            },
            (error) => {
                console.error('Error adding ticket', error);
            }
        );
    }
}




}
