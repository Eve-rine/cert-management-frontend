import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService, Customer } from '../../../services/customers.service';
declare var bootstrap: any;

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  form: Customer = { name: '', email: '', phone: '' };
  success = '';
  error = '';

  constructor(private customersService: CustomersService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: () => this.error = 'Failed to load customers'
    });
  }

  openModal() {
    const modalEl = document.getElementById('addCustomerModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  addCustomer() {
    if (!this.form.name || !this.form.email) {
      this.error = 'Name and email required';
      this.success = '';
      return;
    }
    this.customersService.createCustomer({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Customer added successfully!';
        this.error = '';
        this.loadCustomers();
        this.form = { name: '', email: '', phone: '' };
        const modalEl = document.getElementById('addCustomerModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = 'Failed to add customer';
        this.success = '';
      }
    });
  }
}