import React, { useState, useEffect } from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import { Customer } from './types/Customer';
import { customerService } from './services/customerService';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData: Omit<Customer, 'customerId' | 'registrationDate' | 'updatedAt'>) => {
    try {
      setError(null);
      const newCustomer = await customerService.createCustomer(customerData);
      setCustomers([...customers, newCustomer]);
      setIsFormVisible(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    }
  };

  const handleUpdateCustomer = async (customerId: string, customerData: Omit<Customer, 'customerId' | 'registrationDate' | 'updatedAt'>) => {
    try {
      setError(null);
      const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
      setCustomers(customers.map(c => c.customerId === customerId ? updatedCustomer : c));
      setSelectedCustomer(null);
      setIsFormVisible(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setError(null);
        await customerService.deleteCustomer(customerId);
        setCustomers(customers.filter(c => c.customerId !== customerId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete customer');
      }
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setSelectedCustomer(null);
    setIsFormVisible(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Management System</h1>
      </header>
      
      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={() => setIsFormVisible(true)}
            disabled={isFormVisible}
          >
            Add New Customer
          </button>
          <button 
            className="btn btn-secondary"
            onClick={loadCustomers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isFormVisible && (
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={selectedCustomer ? 
              (data) => handleUpdateCustomer(selectedCustomer.customerId, data) :
              handleCreateCustomer
            }
            onCancel={handleCancelForm}
          />
        )}

        <CustomerList
          customers={customers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
