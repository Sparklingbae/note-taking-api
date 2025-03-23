export interface Category {
    id: string;
    name: string;
  }
  
  export interface Note {
    id: string;
    title: string;
    content: string;
    categoryId: string; 
    createdAt: Date;
    updatedAt?: Date;
  }  