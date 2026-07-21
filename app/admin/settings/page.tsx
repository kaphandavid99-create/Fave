'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Save,
  Bell,
  CreditCard,
  User,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Palette,
  ToggleLeft,
  ToggleRight,
  Check,
  X,
  Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailCustomers: true,
    emailReviews: true,
    smsBookings: false,
    smsReminders: true,
    pushNotifications: true,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from API on mount
  useEffect(() => {
    loadSettings('notifications');
  }, []);

  const loadSettings = async (category: string) => {
    try {
      const response = await fetch(`/api/settings?category=${category}`);
      const data = await response.json();
      
      if (data.success && category === 'notifications') {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async (tab: string, settingsData?: any) => {
    setSaveStatus('saving');
    setSaveMessage('');
    
    try {
      const settingsToSave = settingsData || getSettingsForTab(tab);
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: tab,
          settings: settingsToSave
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveStatus('success');
        setSaveMessage(`${tab.charAt(0).toUpperCase() + tab.slice(1)} settings saved successfully!`);
        
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveMessage('');
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  const getSettingsForTab = (tab: string) => {
    switch(tab) {
      case 'notifications':
        return notifications;
      default:
        return {};
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'users', label: 'Users', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Settings</h1>
        <p className="text-[#454545]">Configure your salon's preferences and settings</p>
      </div>

      {/* Success/Error Message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              saveStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              saveStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {saveStatus === 'success' && <Check size={20} />}
            {saveStatus === 'error' && <X size={20} />}
            {saveStatus === 'saving' && <Loader2 size={20} className="animate-spin" />}
            <span className="font-medium">{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#8A4A32] text-white shadow-lg'
                      : 'text-[#454545] hover:bg-[#F7F1EC]'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && <GeneralSettings onSave={handleSave} saveStatus={saveStatus} />}
          {activeTab === 'notifications' && <NotificationSettings notifications={notifications} setNotifications={setNotifications} onSave={handleSave} saveStatus={saveStatus} />}
          {activeTab === 'payment' && <PaymentSettings onSave={handleSave} saveStatus={saveStatus} />}
          {activeTab === 'users' && <UserSettings onSave={handleSave} saveStatus={saveStatus} />}
          {activeTab === 'security' && <SecuritySettings onSave={handleSave} saveStatus={saveStatus} />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings({ onSave, saveStatus }: any) {
  const [formData, setFormData] = useState({
    salonName: "Fave's Touch Luxury Braiding",
    businessEmail: 'info@favestouch.com',
    phoneNumber: '+1 (555) 123-4567',
    website: 'https://favestouch.com',
    address: '123 Luxury Lane, Beauty District, NY 10001',
    description: "Experience the intersection of heritage craftsmanship and modern luxury. We specialize in intricate braiding techniques that prioritize both aesthetic excellence and hair health.",
    openingTime: '09:00',
    closingTime: '18:00',
    primaryColor: '#8A4A32',
    secondaryColor: '#5C241E',
    backgroundColor: '#F7F1EC',
    textColor: '#3A241C',
  });

  useEffect(() => {
    loadGeneralSettings();
  }, []);

  const loadGeneralSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=general');
      const data = await response.json();
      
      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error loading general settings:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave('general', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Salon Information */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Salon Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Salon Name</label>
            <input
              type="text"
              value={formData.salonName}
              onChange={(e) => handleInputChange('salonName', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Business Email</label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => handleInputChange('businessEmail', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#454545] mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#454545] mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Business Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Default Opening Time</label>
            <input
              type="time"
              value={formData.openingTime}
              onChange={(e) => handleInputChange('openingTime', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Default Closing Time</label>
            <input
              type="time"
              value={formData.closingTime}
              onChange={(e) => handleInputChange('closingTime', e.target.value)}
              className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Appearance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="w-12 h-12 rounded border border-[#3A241C]/20 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="flex-1 px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className="w-12 h-12 rounded border border-[#3A241C]/20 cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className="flex-1 px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded border border-[#3A241C]/20 cursor-pointer"
              />
              <input
                type="text"
                value={formData.backgroundColor}
                onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                className="flex-1 px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => handleInputChange('textColor', e.target.value)}
                className="w-12 h-12 rounded border border-[#3A241C]/20 cursor-pointer"
              />
              <input
                type="text"
                value={formData.textColor}
                onChange={(e) => handleInputChange('textColor', e.target.value)}
                className="flex-1 px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function NotificationSettings({ notifications, setNotifications, onSave, saveStatus }: any) {
  const handleSave = () => {
    onSave('notifications', notifications);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Email Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'emailBookings', label: 'New booking notifications', description: 'Receive email when new bookings are made' },
            { key: 'emailCustomers', label: 'Customer updates', description: 'Receive email for customer profile changes' },
            { key: 'emailReviews', label: 'Review notifications', description: 'Receive email when customers leave reviews' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#F7F1EC]/50 rounded-lg">
              <div>
                <p className="font-medium text-[#3A241C]">{item.label}</p>
                <p className="text-sm text-[#454545]">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className="relative"
              >
                {notifications[item.key] ? (
                  <ToggleRight size={32} className="text-[#8A4A32]" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">SMS Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'smsBookings', label: 'Booking confirmations', description: 'Send SMS confirmation for bookings' },
            { key: 'smsReminders', label: 'Appointment reminders', description: 'Send SMS reminders to customers' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#F7F1EC]/50 rounded-lg">
              <div>
                <p className="font-medium text-[#3A241C]">{item.label}</p>
                <p className="text-sm text-[#454545]">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className="relative"
              >
                {notifications[item.key] ? (
                  <ToggleRight size={32} className="text-[#8A4A32]" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Push Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'pushNotifications', label: 'Enable push notifications', description: 'Receive browser push notifications' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#F7F1EC]/50 rounded-lg">
              <div>
                <p className="font-medium text-[#3A241C]">{item.label}</p>
                <p className="text-sm text-[#454545]">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className="relative"
              >
                {notifications[item.key] ? (
                  <ToggleRight size={32} className="text-[#8A4A32]" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function PaymentSettings({ onSave, saveStatus }: any) {
  const handleSave = () => {
    onSave('payment');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Payment Settings</h2>
        <p className="text-[#454545]">Configure your payment methods and billing preferences.</p>
        <div className="mt-4 p-4 bg-[#F7F1EC]/50 rounded-lg">
          <p className="text-sm text-[#454545]">Payment integration will be added in a future update.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function UserSettings({ onSave, saveStatus }: any) {
  const handleSave = () => {
    onSave('users');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">User Management</h2>
        <p className="text-[#454545]">Manage admin users and their permissions.</p>
        <div className="mt-4 p-4 bg-[#F7F1EC]/50 rounded-lg">
          <p className="text-sm text-[#454545]">User management features will be added in a future update.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function SecuritySettings({ onSave, saveStatus }: any) {
  const handleSave = () => {
    onSave('security');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <h2 className="text-xl font-serif text-[#3A241C] mb-6">Security Settings</h2>
        <p className="text-[#454545]">Configure your account security and authentication settings.</p>
        <div className="mt-4 p-4 bg-[#F7F1EC]/50 rounded-lg">
          <p className="text-sm text-[#454545]">Security features will be added in a future update.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}