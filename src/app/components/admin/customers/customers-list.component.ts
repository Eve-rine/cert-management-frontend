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
  editingCustomer: Customer | null = null;
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

  openModal(customer?: Customer) {
    if (customer) {
      this.editingCustomer = customer;
      this.form = { ...customer };
    } else {
      this.editingCustomer = null;
      this.form = { name: '', email: '', phone: '' };
    }
    
    const modalEl = document.getElementById('addCustomerModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  saveCustomer() {
    if (!this.form.name || !this.form.email) {
      this.error = 'Name and email required';
      this.success = '';
      return;
    }

    if (this.editingCustomer?.id) {
      this.customersService.updateCustomer(this.editingCustomer.id, { ...this.form }).subscribe({
        next: () => {
          this.success = 'Customer updated successfully!';
          this.error = '';
          this.loadCustomers();
          this.closeModal();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to update customer';
          this.success = '';
        }
      });
    } else {
      this.customersService.createCustomer({ ...this.form }).subscribe({
        next: () => {
          this.success = 'Customer added successfully!';
          this.error = '';
          this.loadCustomers();
          this.closeModal();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to add customer';
          this.success = '';
        }
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (!customer.id) return;
    
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customersService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.success = 'Customer deleted successfully!';
          this.error = '';
          this.loadCustomers();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to delete customer';
          this.success = '';
        }
      });
    }
  }

  closeModal() {
    this.form = { name: '', email: '', phone: '' };
    this.editingCustomer = null;
    const modalEl = document.getElementById('addCustomerModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }
}