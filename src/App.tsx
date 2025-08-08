import React, { useState, useEffect } from 'react';
import AuthLogin from './components/AuthLogin';
import Settings from './components/Settings';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LeadsPipeline from './components/LeadsPipeline';
import CustomersList from './components/CustomersList';
import CustomerDetail from './components/CustomerDetail';
import DealDetail from './components/DealDetail';
import DealsPipeline from './components/DealsPipeline';
import BillingList from './components/BillingList';
import LeadEntry from './components/LeadEntry';
import CustomerEntry from './components/CustomerEntry';
import DealEntry from './components/DealEntry';
import BillEntry from './components/BillEntry';
import DealsList from './components/DealsList';
import NoteEntry from './components/NoteEntry';
import SupportTicketEntry from './components/SupportTicketEntry';
import SupportTickets from './components/SupportTickets';
import SearchBar from './components/SearchBar';
import InventoryList from './components/InventoryList';
import InventoryEntry from './components/InventoryEntry';
import { 
  mockLeads, 
  mockCustomers, 
  mockDeals, 
  mockBills, 
  mockNotes, 
  mockReminders,
  mockDashboardStats,
  mockSupportTickets
} from './utils/data';
import { Lead, Customer, Deal, Bill, Note, Reminder, DashboardStats, SupportTicket, Inventory } from './utils/types';
import BillDetail from './components/BillDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState<'homepage' | 'leads' | 'customers' | 'deals' | 'billing' | 'deals-list' | 'support-tickets'>('homepage');
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('profile');
  const [isLeadEntryOpen, setIsLeadEntryOpen] = useState(false);
  const [isCustomerEntryOpen, setIsCustomerEntryOpen] = useState(false);
  const [isDealEntryOpen, setIsDealEntryOpen] = useState(false);
  const [isBillEntryOpen, setIsBillEntryOpen] = useState(false);
  const [isNoteEntryOpen, setIsNoteEntryOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDealDetailOpen, setIsDealDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isSupportTicketEntryOpen, setIsSupportTicketEntryOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isBillDetailOpen, setIsBillDetailOpen] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [isInventoryEntryOpen, setIsInventoryEntryOpen] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);

  // Branding and theme state
  const [branding, setBranding] = useState({
    name: 'Vinnora CRM',
    tagline: 'Built in India, for Indians',
    logo: null as File | null,
  });
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [layout, setLayout] = useState('default');
  const [previewBranding, setPreviewBranding] = useState<{
    name: string;
    tagline: string;
    logo: File | null;
    themeColor: string;
    layout: string;
  } | null>(null);

  // Apply theme color to document root
  useEffect(() => {
    const color = previewBranding?.themeColor || themeColor;
    document.documentElement.style.setProperty('--theme-color', color);
  }, [themeColor, previewBranding]);

  // Branding values to use (preview or applied)
  const activeBranding = previewBranding
    ? {
        name: previewBranding.name,
        tagline: previewBranding.tagline,
        logo: previewBranding.logo,
        themeColor: previewBranding.themeColor,
        layout: previewBranding.layout,
      }
    : {
        name: branding.name,
        tagline: branding.tagline,
        logo: branding.logo,
        themeColor,
        layout,
      };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowSettings(false);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSaveInventory = (inventoryData: Omit<Inventory, 'id'>) => {
    if (selectedInventory) {
      // Update existing inventory
      const updatedInventory: Inventory = {
        ...selectedInventory,
        ...inventoryData,
      };
      setInventories(inventories.map(inv => 
        inv.id === selectedInventory.id ? updatedInventory : inv
      ));
    } else {
      // Create new inventory
      const newInventory: Inventory = {
        ...inventoryData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setInventories([...inventories, newInventory]);
    }
  };

  const handleSaveLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setLeads([...leads, newLead]);
    updateDashboardStats();
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    updateDashboardStats();
  };

  const handleSaveDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const customer = customers.find(c => c.id === dealData.customerId);
    const newDeal: Deal = {
      ...dealData,
      customerName: customer?.name || 'Unknown Customer',
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDeals([...deals, newDeal]);
    updateDashboardStats();
  };

  const handleSaveBill = (billData: Omit<Bill, 'id' | 'billNumber' | 'gstAmount' | 'totalAmount' | 'createdAt' | 'updatedAt'>) => {
    const customer = customers.find(c => c.id === billData.customerId);
    const gstAmount = (billData.amount * billData.gstRate) / 100;
    const totalAmount = billData.amount + gstAmount;
    const billNumber = `INV-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`;
    
    const newBill: Bill = {
      ...billData,
      customerName: customer?.name || 'Unknown Customer',
      id: Math.random().toString(36).substr(2, 9),
      billNumber,
      gstAmount,
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setBills([...bills, newBill]);
    updateDashboardStats();
  };

  const handleSaveNote = (noteData: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setNotes([...notes, newNote]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
    updateDashboardStats();
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
    updateDashboardStats();
  };

  const handleSaveTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTicket) {
      // Update existing ticket
      const updatedTicket: SupportTicket = {
        ...selectedTicket,
        ...ticketData,
        updatedAt: new Date()
      };
      setSupportTickets(supportTickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
    } else {
      // Create new ticket
      const newTicket: SupportTicket = {
        ...ticketData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSupportTickets([...supportTickets, newTicket]);
    }
  };

  const handleLeadStageChange = (leadId: string, newStage: Lead['stage']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, stage: newStage, updatedAt: new Date() }
        : lead
    ));
    
    // If lead is converted to deal closed, create customer and deal
    if (newStage === 'deal-closed') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        handleConvertLeadToCustomer(lead);
      }
    }
    
    updateDashboardStats();
  };

  const handleDealStageChange = (dealId: string, newStage: Deal['stage']) => {
    setDeals(deals.map(deal => 
      deal.id === dealId 
        ? { ...deal, stage: newStage, updatedAt: new Date() }
        : deal
    ));
    updateDashboardStats();
  };

  const handleConvertLeadToCustomer = (lead: Lead) => {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.location,
      type: 'individual',
      stage: 'qualified',
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    updateDashboardStats();
  };

  const handleReminderComplete = (reminderId: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, completed: true }
        : reminder
    ));
  };

  const updateDashboardStats = () => {
    const stats: DashboardStats = {
      totalLeads: leads.length,
      totalCustomers: customers.length,
      totalDeals: deals.length,
      totalRevenue: deals
        .filter(d => d.stage === 'deal-closed')
        .reduce((sum, d) => sum + d.amount, 0),
      pendingFollowUps: reminders.filter(r => !r.completed).length,
      dealsThisMonth: deals.filter(d => {
        const thisMonth = new Date();
        return d.createdAt.getMonth() === thisMonth.getMonth() &&
               d.createdAt.getFullYear() === thisMonth.getFullYear();
      }).length,
      conversionRate: leads.length > 0 ? 
        Math.round((leads.filter(l => l.stage === 'deal-closed').length / leads.length) * 100) : 0
    };
    
    setDashboardStats(stats);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthLogin onLogin={handleLogin} />
    );
  }

  // Show settings screen
  if (showSettings) {
    return (
      <Settings
        activeSection={activeSettingsSection}
        onSectionChange={setActiveSettingsSection}
        branding={branding}
        setBranding={setBranding}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        layout={layout}
        setLayout={setLayout}
        previewBranding={previewBranding}
        setPreviewBranding={setPreviewBranding}
        onClose={handleCloseSettings}
        currentUser={currentUser}
        activeBranding={activeBranding}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'homepage':
        return (
          <Dashboard
            stats={dashboardStats}
            reminders={reminders}
            recentLeads={leads.slice(0, 5)}
            recentDeals={deals.slice(0, 5)}
            onReminderComplete={handleReminderComplete}
          />
        );
      case 'leads':
        return (
          <LeadsPipeline
            leads={leads}
            onStageChange={handleLeadStageChange}
            onAddLead={() => setIsLeadEntryOpen(true)}
          />
        );
      case 'customers':
        return (
          <CustomersList
            customers={customers}
            onAddCustomer={() => setIsCustomerEntryOpen(true)}
            onEditCustomer={(customer) => {
              setSelectedCustomer(customer);
              setIsCustomerDetailOpen(true);
            }}
          />
        );
      case 'deals':
        return (
          <DealsList
            deals={deals}
            onAddDeal={() => setIsDealEntryOpen(true)}
            onEditDeal={(deal) => {
              setSelectedDeal(deal);
              setIsDealDetailOpen(true);
            }}
          />
        );
      case 'deals-list':
        return (
          <DealsPipeline
            deals={deals}
            onStageChange={handleDealStageChange}
            onAddDeal={() => setIsDealEntryOpen(true)}
          />
        );
      case 'billing':
        return (
          <>
            <BillingList
              bills={bills}
              onAddBill={() => setIsBillEntryOpen(true)}
              onEditBill={(bill) => {
                setSelectedBill(bill);
                setIsBillDetailOpen(true);
              }}
            />
            <BillDetail
              bill={selectedBill}
              isOpen={isBillDetailOpen}
              onClose={() => {
                setIsBillDetailOpen(false);
                setSelectedBill(null);
              }}
              onSave={() => {}} // Add onSave prop
              plan={currentUser?.plan || 'free'} // Pass the user's plan
            />
          </>
        );
      case 'support-tickets':
        return (
          <>
            <SupportTickets
              tickets={supportTickets}
              onAddTicket={() => {
                setSelectedTicket(null); // Ensure modal is empty for new ticket
                setIsSupportTicketEntryOpen(true);
              }}
              onEditTicket={(ticket) => {
                setSelectedTicket(ticket); // Pass selected ticket for editing
                setIsSupportTicketEntryOpen(true);
              }}
              activeTab={activeTab} // <-- add this line
            />
            <SupportTicketEntry
              ticket={selectedTicket || undefined} // Pass selected ticket or undefined
              isOpen={isSupportTicketEntryOpen}
              onClose={() => {
                setIsSupportTicketEntryOpen(false);
                setSelectedTicket(null);
              }}
              onSave={handleSaveTicket}
              customers={customers}
              deals={deals}
            />
          </>
        );
      case 'inventory':
        return (
          <>
            <InventoryList
              inventories={inventories}
              onAddInventory={() => {
                setSelectedInventory(null);
                setIsInventoryEntryOpen(true);
              }}
              onEditInventory={(inventory) => {
                setSelectedInventory(inventory);
                setIsInventoryEntryOpen(true);
              }}
            />
            <InventoryEntry
              inventory={selectedInventory || undefined}
              isOpen={isInventoryEntryOpen}
              onClose={() => {
                setIsInventoryEntryOpen(false);
                setSelectedInventory(null);
              }}
              onSave={handleSaveInventory}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewNote={() => setIsNoteEntryOpen(true)}
        onShowSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        branding={activeBranding}
      >
        {renderActiveTab()}
      </Layout>
      
      <LeadEntry
        isOpen={isLeadEntryOpen}
        onClose={() => setIsLeadEntryOpen(false)}
        onSave={handleSaveLead}
      />
      
      <CustomerEntry
        isOpen={isCustomerEntryOpen}
        onClose={() => setIsCustomerEntryOpen(false)}
        onSave={handleSaveCustomer}
      />
      
      <DealEntry
        isOpen={isDealEntryOpen}
        onClose={() => setIsDealEntryOpen(false)}
        customers={customers}
        onSave={handleSaveDeal}
      />
      
      <BillEntry
        isOpen={isBillEntryOpen}
        onClose={() => setIsBillEntryOpen(false)}
        customers={customers}
        onSave={handleSaveBill}
      />
      
      <NoteEntry
        isOpen={isNoteEntryOpen}
        onClose={() => setIsNoteEntryOpen(false)}
        leads={leads}
        customers={customers}
        deals={deals}
        onSave={handleSaveNote}
      />
      
      {selectedCustomer && (
        <CustomerDetail
          customer={selectedCustomer}
          isOpen={isCustomerDetailOpen}
          onClose={() => {
            setIsCustomerDetailOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleUpdateCustomer}
        />
      )}
      
      {selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          customers={customers}
          isOpen={isDealDetailOpen}
          onClose={() => {
            setIsDealDetailOpen(false);
            setSelectedDeal(null);
          }}
          onSave={handleUpdateDeal}
        />
      )}
      
      <SupportTicketEntry
        ticket={selectedTicket || undefined}
        isOpen={isSupportTicketEntryOpen}
        onClose={() => {
          setIsSupportTicketEntryOpen(false);
          setSelectedTicket(null);
        }}
        onSave={handleSaveTicket}
        customers={customers}
        deals={deals}
      />
    </>
  );
}

export default App;