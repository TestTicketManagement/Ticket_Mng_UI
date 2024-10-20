import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TicketService } from '../Services/ticket.service';
import { GeneralResponse, SaveTicket, Ticket } from '../models/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private ticketService : TicketService ,
              private modalService : NgbModal ,
              private fb : FormBuilder
            ) { }

  tickets : Ticket[] = [];
  TicketForm! : FormGroup;
  filteredTickets: Ticket[] = [];
  searchTerm: string = '';
  page: number = 1;
  isUpdate: boolean = false;
  selectedTicket: SaveTicket | null = null;
  modalRef!: NgbModalRef;
  fuse!: Fuse<Ticket>;

  @ViewChild('ticketModal') ticketModal!: TemplateRef<any>;

  ngOnInit(): void {

    this.loadTickets();
    this.validateForm();


  }

validateForm()
{
  this.TicketForm = this.fb.group({
    ticketId : ['', [Validators.required , Validators.pattern('^[0-9]*$')]],
    description : ['',[Validators.required, Validators.minLength(5),]],
    status: [0, Validators.required]
  });
}


filterTickets(): void {
  if (this.searchTerm.trim() === '') {
    this.filteredTickets = this.tickets;
  } else {
    const options = {
      keys: ['description', 'status', 'id'],
      threshold: 0.3  
    };
    
    this.fuse = new Fuse(this.tickets, options);
    const results = this.fuse.search(this.searchTerm);
    this.filteredTickets = results.map(result => result.item);
  }
}


get TicketId(): FormControl{
  return this.TicketForm.get('ticketId') as FormControl;
}

get Description(): FormControl{
  return this.TicketForm.get('description') as FormControl;
}



  loadTickets(): void {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.filteredTickets = this.tickets;
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

    this.TicketForm.reset({
      ticketId: '',
      description: '',
      status: 0 
    });
    this.modalRef = this.modalService.open(this.ticketModal);
  }

  openUpdateTicketModal(ticket: Ticket): void {
    this.isUpdate = true;
    const statusNumber = ticket.status === 'Open' ? 0 : 1;
  
    this.selectedTicket = {
      id: ticket.id,
      description: ticket.description,
      status: statusNumber,
    };

    this.TicketForm.setValue({
      ticketId: this.selectedTicket.id,
      description: this.selectedTicket.description,
      status: this.selectedTicket.status
    });

    console.log(this.selectedTicket);
  
    this.modalRef = this.modalService.open(this.ticketModal);
  }


  addTicket(): void {

     this.selectedTicket  = {
      id: this.TicketForm.value.ticketId,
      description: this.TicketForm.value.description,
      status: this.TicketForm.value.status
    };

       this.ticketService.addTicket(this.selectedTicket).subscribe(
            (response: GeneralResponse) => {
                if (response.flag) {
                  alert(response.message);
                    this.loadTickets(); 
                    this.modalRef.dismiss();
                } else {
                    alert(response.message);
                }
            },
            (error) => {
                console.error('Error adding ticket', error);
            }
        );
    }



updateTicket(): void {

  this.selectedTicket = {
    id: this.TicketForm.value.ticketId,
    description: this.TicketForm.value.description,
    status: this.TicketForm.value.status
  };

  if (this.selectedTicket) {
    this.ticketService.updateTicket(this.selectedTicket).subscribe(
      (response: GeneralResponse) => {
        if (response.flag) {
          alert(response.message);
          this.loadTickets();
          this.modalRef.dismiss(); 
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error('Error updating ticket', error);
      }
    );
  }
}

confirmDeleteTicket(ticketId: number): void {
  const confirmed = window.confirm('Are you sure you want to delete this ticket?');
  
  if (confirmed) {
    this.deleteTicket(ticketId);
  }
}

deleteTicket(ticketId: number): void {
  this.ticketService.deleteTicket(ticketId).subscribe(
    (response: GeneralResponse) => {
      if (response.flag) {
        alert(response.message);
        this.loadTickets(); 
      } else {
        alert('Error deleting ticket');
      }
    },
    (error) => {
      console.error('Error deleting ticket', error);
    }
  );
}


}








