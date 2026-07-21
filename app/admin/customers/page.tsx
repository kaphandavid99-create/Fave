'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  User,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  Loader2
} from 'lucide-react';
import CustomerForm from '@/components/admin/CustomerForm';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  preferences: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch customers');
      }

      setCustomers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      await fetchCustomers();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingCustomer 
        ? `/api/customers/${editingCustomer.id}`
        : '/api/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(editingCustomer ? 'Failed to update customer' : 'Failed to create customer');
      }

      await fetchCustomers();
      setShowForm(false);
      setEditingCustomer(null);
    } catch (err) {
      throw err;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#8A4A32] size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchCustomers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Customers Management</h1>
          <p className="text-[#454545]">Manage your customer database and relationships</p>
        </div>
        <button 
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Total Customers</p>
              <p className="text-2xl font-bold text-[#3A241C]">{customers.length}</p>
            </div>
            <User className="text-[#8A4A32]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => {
                  const date = new Date(c.created_at);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Award className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">With Phone</p>
              <p className="text-2xl font-bold text-[#3A241C]">{customers.filter(c => c.phone).length}</p>
            </div>
            <Phone className="text-[#8A4A32]" size={24} />
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Customer Header */}
            <div className="bg-gradient-to-r from-[#8A4A32] to-[#5C241E] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#8A4A32] font-serif font-bold text-xl">
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">{customer.name}</h3>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-lg transition">
                  <MoreVertical size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#8A4A32]" />
                <span className="text-[#454545]">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-[#8A4A32]" />
                  <span className="text-[#454545]">{customer.phone}</span>
                </div>
              )}
              <div className="pt-4 border-t border-[#3A241C]/10">
                <p className="text-xs text-[#454545]">Member since {new Date(customer.created_at).toLocaleDateString()}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A241C]/10">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingCustomer(customer);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-[#F7F1EC] rounded-lg transition" 
                    title="Edit"
                  >
                    <Edit size={16} className="text-[#8A4A32]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition" 
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-[#3A241C]/10">
          <User className="mx-auto text-[#8A4A32] size-12 mb-4" />
          <p className="text-[#454545]">No customers found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
}
