export interface Ticket {
    id: number;
    description: string;
    status: string;  // open or closed
    creationDate: string;
  }

  export interface SaveTicket {
    id: number;
    description: string;
    status: number;  
  }

  export interface GeneralResponse{
    flag : boolean;
    message : string;
  }

