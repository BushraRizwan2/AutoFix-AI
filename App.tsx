
import React, { useState, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import { CustomerPortal } from './portals/CustomerPortal';
import { ShopPortal } from './portals/shop/ShopPortal';
import { AdminPortal } from './portals/AdminPortal';
import { User, UserRole, Job, Shop, ManualQuote, ChatMessage, JobStatus, StaffMember, ShopService, Part, SupportTicket, ClientDetails, AIAnalysisResult, Invoice, InvoiceItem, AppSettings, InventoryPart } from './types';
import { Spinner } from './components/Spinner';
import { LandingPage } from './components/LandingPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from './components/Toast';

// --- MOCK DATA EXPANSION ---

// 1. Staff Members
const mockStaff: StaffMember[] = [
    { 
        id: 'staff-1', name: 'John "Wrench" Doe', role: 'Bodytech',
        email: 'j.doe@pro-paint.com', phone: '555-0111', hireDate: '2021-03-15', salary: 65000,
        address: { street: '123 Repair Rd', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
        performanceNotes: [
            { date: '2023-11-20', note: 'Excellent work on the Civic quarter panel replacement.', reviewer: 'David Chen' }
        ]
    },
    { 
        id: 'staff-2', name: 'Jane "Canvas" Smith', role: 'Painter',
        email: 'j.smith@pro-paint.com', phone: '555-0112', hireDate: '2020-07-01', salary: 72000,
        address: { street: '456 Color Ct', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=250&auto=format&fit=crop',
        performanceNotes: [
            { date: '2024-01-15', note: 'Consistently produces high-quality paint finishes. Great attention to detail.', reviewer: 'David Chen' }
        ]
    },
    { 
        id: 'staff-3', name: 'Mike Ross', role: 'Estimator',
        email: 'm.ross@pro-paint.com', phone: '555-0113', hireDate: '2022-09-01', salary: 58000,
        address: { street: '789 Quote Ave', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-4', name: 'Sarah "Sparkle" Lee', role: 'Detailer',
        email: 's.lee@collision-experts.com', phone: '555-0114', hireDate: '2023-01-20', salary: 45000,
        address: { street: '101 Shine St', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-5', name: 'David Chen', role: 'Manager',
        email: 'd.chen@dent-devils.com', phone: '555-0115', hireDate: '2019-05-10', salary: 85000,
        address: { street: '1 Manager Blvd', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-6', name: 'Robert "Jack" Mercer', role: 'Bodytech',
        email: 'r.mercer@pro-paint.com', phone: '555-0116', hireDate: '2022-05-11', salary: 63000,
        address: { street: '24 Park Row', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-7', name: 'Linda "Hue" Vance', role: 'Painter',
        email: 'l.vance@pro-paint.com', phone: '555-0117', hireDate: '2021-11-01', salary: 70000,
        address: { street: '89 Forest Hills', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-8', name: 'James "Spot" Brody', role: 'Detailer',
        email: 'j.brody@pro-paint.com', phone: '555-0118', hireDate: '2023-04-15', salary: 46000,
        address: { street: '333 Scrub Way', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-9', name: 'Nancy Miller', role: 'Estimator',
        email: 'n.miller@pro-paint.com', phone: '555-0119', hireDate: '2022-10-10', salary: 59000,
        address: { street: '404 Quote Ave', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-10', name: 'Arthur Pendelton', role: 'Apprentice',
        email: 'a.pen@pro-paint.com', phone: '555-0120', hireDate: '2024-01-10', salary: 38000,
        address: { street: '512 Helper Way', city: 'Anytown', state: 'CA', zip: '90210' },
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-11', name: 'Peter Parker', role: 'Bodytech',
        email: 'p.parker@pro-paint.com', phone: '555-0121', hireDate: '2023-08-01', salary: 61000,
        address: { street: '20 Ingram St', city: 'Queens', state: 'NY', zip: '11375' },
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    },
    { 
        id: 'staff-12', name: 'Clara Oswald', role: 'Detailer',
        email: 'c.oswald@pro-paint.com', phone: '555-0122', hireDate: '2023-09-01', salary: 47000,
        address: { street: '77 Southerton Rd', city: 'London', state: 'UK', zip: 'W6 0LT' },
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop',
        performanceNotes: []
    }
];

// 2. Services
const mockServices: ShopService[] = [
    { id: 'serv-1', name: 'Bumper Repair', price: 350, duration: 4 },
    { id: 'serv-2', name: 'Full Repaint', price: 2500, duration: 40 },
    { id: 'serv-3', name: 'Paintless Dent Repair', price: 150, duration: 2 },
    { id: 'serv-4', name: 'Headlight Restoration', price: 80, duration: 1 },
    { id: 'serv-5', name: 'Frame Straightening', price: 1200, duration: 24 },
    { id: 'serv-6', name: 'Alloy Wheel Refurbish', price: 180, duration: 3 },
    { id: 'serv-7', name: 'Windshield Chip Repair', price: 95, duration: 1 },
    { id: 'serv-8', name: 'Ceramic Coating Protection', price: 850, duration: 8 },
    { id: 'serv-9', name: 'Fender Scratch Buff & Polish', price: 120, duration: 2 },
    { id: 'serv-10', name: 'Side Mirror Replacement', price: 210, duration: 2 },
    { id: 'serv-11', name: 'Rust Treatment & Undercoating', price: 450, duration: 6 },
    { id: 'serv-12', name: 'PPF (Paint Protection Film) Installation', price: 1500, duration: 16 }
];

// 3. Inventory
const mockInventory: InventoryPart[] = [
    { id: 'inv-1', name: 'OEM Bumper Clip A-52', supplier: 'OEM Parts Co', stock: 50, price: 2.50 },
    { id: 'inv-2', name: 'Primer (1 Gallon)', supplier: 'Paint Supplies Inc.', stock: 10, price: 75.00 },
    { id: 'inv-3', name: 'Clear Coat (1 Quart)', supplier: 'Paint Supplies Inc.', stock: 15, price: 45.00 },
    { id: 'inv-4', name: '3M Sanding Disc P500', supplier: '3M Auto', stock: 200, price: 0.80 },
    { id: 'inv-5', name: 'Masking Tape Blue 2-inch', supplier: '3M Auto', stock: 45, price: 5.50 },
    { id: 'inv-6', name: 'Basecoat Paint Alpine White', supplier: 'OEM Colors', stock: 8, price: 120.00 },
    { id: 'inv-7', name: 'Polishing Pad Foam Orange', supplier: 'Buffing Tech', stock: 30, price: 12.00 },
    { id: 'inv-8', name: 'Fender Liners Right Front', supplier: 'Depo Corp', stock: 5, price: 65.00 },
    { id: 'inv-9', name: 'LED Headlight Housing Assembly', supplier: 'Lighting Depot', stock: 4, price: 340.00 },
    { id: 'inv-10', name: 'Bumper Cover Retainer Clip', supplier: 'OEM Parts Co', stock: 150, price: 1.20 },
    { id: 'inv-11', name: 'Tack Cloth Anti-Static', supplier: 'SIA Abrasives', stock: 80, price: 1.50 },
    { id: 'inv-12', name: 'Aluminum Panel Welding Rods', supplier: 'WeldSource', stock: 25, price: 35.00 }
];


// 4. Shops
const mockShops: Shop[] = [
  { id: 1, name: 'Pro Paint & Body', address: '123 Auto Row, Anytown, USA', phone: '555-0101', rating: 4.8, reviewCount: 152, position: { x: '25%', y: '30%' }, status: 'Approved', availability: true, services: mockServices, staff: mockStaff, priceRange: 'medium', inventory: mockInventory },
  { id: 2, name: 'Collision Experts Inc.', address: '456 Repair Rd, Anytown, USA', phone: '555-0102', rating: 4.6, reviewCount: 89, position: { x: '70%', y: '20%' }, status: 'Approved', availability: false, services: [mockServices[0], mockServices[4]], staff: [mockStaff[3]], priceRange: 'high', inventory: [] },
  { id: 3, name: 'First Class Auto Finish', address: '789 Dent Dr, Anytown, USA', phone: '555-0103', rating: 4.9, reviewCount: 210, position: { x: '45%', y: '65%' }, status: 'Suspended', availability: true, services: [mockServices[1], mockServices[3]], staff: [], priceRange: 'high', inventory: [] },
  { id: 4, name: 'New Gen Repairs', address: '101 Fixit Ave, Anytown, USA', phone: '555-0104', rating: 0, reviewCount: 0, position: {x:'80%',y:'70%'}, status: 'Pending', availability: true, services: [], staff: [], priceRange: 'low', inventory: [] },
  { id: 5, name: 'Quick Fix Auto', address: '210 Scratch St, Sometown, USA', phone: '555-0105', rating: 4.2, reviewCount: 56, position: { x: '10%', y: '80%' }, status: 'Approved', availability: true, services: [mockServices[2], mockServices[3]], staff: [], priceRange: 'low', inventory: [] },
  { id: 6, name: 'The Dent Devils', address: '666 PDR Pl, Anytown, USA', phone: '555-0106', rating: 5.0, reviewCount: 301, position: { x: '50%', y: '5%' }, status: 'Approved', availability: true, services: [mockServices[2]], staff: [mockStaff[4]], priceRange: 'medium', inventory: [] },
  { id: 7, name: 'Prestige Paintworks', address: '1 Luxury Ln, Uptown, USA', phone: '555-0107', rating: 4.7, reviewCount: 99, position: { x: '90%', y: '45%' }, status: 'Approved', availability: true, services: [mockServices[1]], staff: [], priceRange: 'high', inventory: [] },
  { id: 8, name: 'Frame & Fame', address: '8 Frame Ct, Anytown, USA', phone: '555-0108', rating: 4.5, reviewCount: 112, position: { x: '5%', y: '15%' }, status: 'Approved', availability: false, services: [mockServices[4]], staff: [], priceRange: 'medium', inventory: [] },
  { id: 9, name: 'Your Town Auto Body', address: '9 Main St, Yourtown, USA', phone: '555-0109', rating: 3.9, reviewCount: 42, position: { x: '95%', y: '90%' }, status: 'Approved', availability: true, services: [mockServices[0], mockServices[3]], staff: [], priceRange: 'low', inventory: [] },
  { id: 10, name: 'Admin Test Shop', address: '1 Admin Way, System, USA', phone: '555-0110', rating: 0, reviewCount: 0, position: {x:'50%', y: '50%'}, status: 'Pending', availability: false, services: [], staff: [], priceRange: 'medium', inventory: [] },
  { id: 11, name: 'Apex Paint & Finish', address: '55 Apex Blvd, Goldtown, USA', phone: '555-0111', rating: 4.7, reviewCount: 15, position: { x: '15%', y: '40%' }, status: 'Approved', availability: true, services: [mockServices[0], mockServices[1]], staff: [], priceRange: 'high', inventory: [] },
  { id: 12, name: 'Corner Garage Group', address: '99 Junction Rd, Westtown, USA', phone: '555-0112', rating: 4.2, reviewCount: 38, position: { x: '82%', y: '12%' }, status: 'Approved', availability: true, services: [mockServices[2], mockServices[3]], staff: [], priceRange: 'low', inventory: [] },
  { id: 13, name: 'Metro Collision Center', address: '500 Corporate Ave, Cityville, USA', phone: '555-0113', rating: 4.4, reviewCount: 57, position: { x: '35%', y: '85%' }, status: 'Approved', availability: true, services: [mockServices[4]], staff: [], priceRange: 'medium', inventory: [] }
];

// 5. Jobs
const initialJobs: Job[] = [
    // Customer 1: customer@example.com
    {
        id: 'JOB-9876',
        customerEmail: 'customer@example.com',
        clientDetails: { name: 'Alice Johnson', address: '123 Main St, Anytown' },
        shop: mockShops[1],
        carDetails: { make: 'Honda', model: 'Civic', year: '2021', vin: '1HGFB2F57L012345', registrationNo: 'XYZ-789' },
        photos: { damage: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiWEs3Tm9ZQUY2SkZFSnI0YjV4eUNLdy5qcGcifQ=='], inProgress: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiR0s0cGtGVVJjUVhFR29wTEpCMHlRdy5qcGcifQ=='], completed: [] },
        status: 'Awaiting Payment',
        bookingDate: '2024-08-05',
        lastUpdate: '2024-07-30T10:00:00Z',
        assignedStaff: [mockStaff[0]],
        parts: [{ id: 'part-1', name: 'Passenger Mirror Assembly', supplier: 'OEM Parts Co', price: 125.00, status: 'Received' }],
        notes: 'Customer waiting for final invoice.',
        quote: { items: [{ description: 'Passenger Side Mirror Assembly', quantity: 1, price: 125.00 }, { description: 'Labor - Installation', quantity: 1.5, price: 50.00 }], total: 200.00, notes: 'Replaced passenger side mirror assembly.'},
        chatHistory: [{ id: '1', sender: 'system', text: 'Job created. Awaiting drop-off.', timestamp: '2024-07-28T09:00:00Z'}, { id: '2', sender: 'shop', text: 'We have received your vehicle and will begin repairs shortly.', timestamp: '2024-07-29T11:00:00Z'}, { id: '3', sender: 'shop', text: 'Repairs are complete! Your vehicle is ready for pickup. Please review the invoice and complete payment.', timestamp: '2024-07-30T10:00:00Z'}],
        invoice: { id: 'INV-001', date: '2024-07-30', items: [ { description: 'Passenger Side Mirror Assembly', quantity: 1, price: 125.00 }, { description: 'Labor - Installation', quantity: 1.5, price: 50.00 }, ], subtotal: 200.00, tax: 16.00, total: 216.00 }
    },
    {
        id: 'JOB-5555',
        customerEmail: 'customer@example.com',
        shop: mockShops[0],
        carDetails: { make: 'Tesla', model: 'Model 3', year: '2023', vin: '5YJ3E1EA5PF12345', registrationNo: 'TSL-555' },
        photos: { damage: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiT3N5YW5CQVlqZ1NBaUFaelJ2aVdudy5qcGcifQ=='], inProgress: [], completed: [] },
        status: 'Quote Provided',
        lastUpdate: '2024-07-30T11:20:00Z',
        quote: { items: [{ description: 'Bumper scuff repair and repaint', quantity: 1, price: 250.00 }, { description: 'Sensor recalibration', quantity: 1, price: 150.00 }], total: 400.00, notes: 'Requires recalibration of parking sensors after repaint. Quote valid for 7 days.'},
        chatHistory: [{ id: '1', sender: 'system', text: 'Quote requested from Pro Paint & Body.', timestamp: '2024-07-30T09:00:00Z'}, { id: '2', sender: 'shop', text: 'Thanks for your request. We have reviewed the images and prepared a quote for you.', timestamp: '2024-07-30T11:20:00Z'},],
    },
    {
        id: 'JOB-1234',
        customerEmail: 'customer@example.com',
        shop: mockShops[0],
        carDetails: { make: 'Ford', model: 'Mustang', year: '2022', vin: '1FATP8CUXN512345', registrationNo: 'ABC-123' },
        photos: { damage: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiT3N5YW5CQVlqZ1NBaUFaelJ2aVdudy5qcGcifQ=='], inProgress: [], completed: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiZXVUdjhaZDR3cjFCTGRlTjVtZTluZy5qcGcifQ=='] },
        status: 'Completed',
        bookingDate: '2024-07-20',
        lastUpdate: '2024-07-25T14:00:00Z',
        quote: { items: [{ description: 'Bumper scuff repair and repaint', quantity: 1, price: 220.00 }], total: 220.00, },
        chatHistory: [],
        invoice: { id: 'INV-002', date: '2024-07-25', items: [{ description: 'Bumper scuff repair and repaint', quantity: 1, price: 220.00 }], subtotal: 220.00, tax: 17.60, total: 237.60 },
        rating: 5,
        reviewText: "Great work, looks brand new!",
    },
    {
        id: 'JOB-ESTIMATE',
        customerEmail: 'customer@example.com',
        shop: mockShops[6],
        carDetails: { make: 'Porsche', model: '911', year: '2023', vin: '', registrationNo: '' },
        photos: { damage: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiT3N5YW5CQVlqZ1NBaUFaelJ2aVdudy5qcGcifQ=='], inProgress: [], completed: [] },
        status: 'Estimate',
        aiAnalysis: { damageType: 'Rear Quarter Panel Scratch', estimatedCost: '$800 - $1200', estimatedTime: '3-4 Days', confidence: 92 },
        lastUpdate: '2024-08-01T10:00:00Z',
        chatHistory: [],
    },
    // Customer 2: another.user@example.com
    {
        id: 'JOB-4321',
        customerEmail: 'another.user@example.com',
        clientDetails: { name: 'Bob Williams', address: '456 Oak Ave, Anytown' },
        shop: mockShops[0], 
        carDetails: { make: 'Subaru', model: 'Outback', year: '2020', vin: '4S4BTANC0L312345', registrationNo: 'SUB-432' },
        photos: { damage: ['https://storage.googleapis.com/framer-ai-images/eyJidWNrZXQiOiJmcmFtZXItYWktイメージズIiwia2V5IjoiWGxTdG53WnVma0ZpWGRySW1XVkRndy5qcGcifQ=='], inProgress: [], completed: [] },
        status: 'New',
        lastUpdate: '2024-07-31T14:00:00Z',
        chatHistory: [],
    },
    {
        id: 'JOB-CANC',
        customerEmail: 'another.user@example.com',
        shop: mockShops[4],
        carDetails: { make: 'Kia', model: 'Telluride', year: '2023', vin: '', registrationNo: 'KIA-TEL' },
        photos: { damage: [], inProgress: [], completed: [] },
        status: 'Cancelled',
        lastUpdate: '2024-07-29T10:00:00Z',
        chatHistory: [],
        quote: { items: [{ description: 'Initial Inspection', quantity: 1, price: 50 }], total: 50 },
    },
    // Customer 3: test.user@example.com
    {
        id: 'JOB-BCONF',
        customerEmail: 'test.user@example.com',
        clientDetails: { name: 'Charlie Brown', address: '789 Pine Ln, Sometown' },
        shop: mockShops[5],
        carDetails: { make: 'Chevrolet', model: 'Silverado', year: '2022', vin: '1GCGTF9A1NZ12345', registrationNo: 'TRK-BD' },
        photos: { damage: [], inProgress: [], completed: [] },
        status: 'Booking Confirmed',
        bookingDate: '2024-08-15',
        lastUpdate: '2024-08-02T10:00:00Z',
        chatHistory: [],
        quote: { items: [{ description: 'Tailgate Dent Repair', quantity: 1, price: 450 }], total: 450 },
    },
    // Customer 4: new.customer@example.com
    {
        id: 'JOB-INREP',
        customerEmail: 'new.customer@example.com',
        shop: mockShops[7],
        carDetails: { make: 'BMW', model: 'X5', year: '2021', vin: '', registrationNo: 'BMW-X5' },
        photos: { damage: [], inProgress: [], completed: [] },
        status: 'In Repair',
        bookingDate: '2024-08-01',
        lastUpdate: '2024-08-02T11:00:00Z',
        chatHistory: [],
        assignedStaff: [],
    },
    // Customer 5: jane.doe@example.com
    {
        id: 'JOB-PAINT',
        customerEmail: 'jane.doe@example.com',
        shop: mockShops[6],
        carDetails: { make: 'Audi', model: 'Q5', year: '2020', vin: '', registrationNo: 'AUD-Q5' },
        photos: { damage: [], inProgress: [], completed: [] },
        status: 'Painting',
        bookingDate: '2024-08-03',
        lastUpdate: '2024-08-05T12:00:00Z',
        chatHistory: [],
        assignedStaff: [],
    },
    // Customer 6: mike.jones@example.com
    {
        id: 'JOB-FCHECK',
        customerEmail: 'mike.jones@example.com',
        shop: mockShops[0],
        carDetails: { make: 'Jeep', model: 'Wrangler', year: '2019', vin: '', registrationNo: 'JEEP-W' },
        photos: { damage: [], inProgress: [], completed: [] },
        status: 'Final Check',
        bookingDate: '2024-08-04',
        lastUpdate: '2024-08-06T13:00:00Z',
        chatHistory: [],
    },
    // More jobs for Pro Paint & Body (shopId 1)
    ...Array.from({ length: 30 }, (_, i) => {
        const statuses: JobStatus[] = ['New', 'Quote Provided', 'Booking Confirmed', 'In Repair', 'Painting', 'Final Check', 'Awaiting Payment', 'Completed', 'Cancelled'];
        const customers = [
            'customer@example.com', 'david.lee@example.com', 'emily.chen@example.com', 
            'frank.wright@example.com', 'grace.hall@example.com', 'henry.king@example.com', 
            'isabella.ward@example.com', 'jack.yates@example.com', 'kate.vance@example.com', 
            'leo.xavier@example.com'
        ];
        const cars = [
            { make: 'Toyota', model: 'Camry' }, { make: 'Honda', model: 'Accord' }, { make: 'Ford', model: 'F-150' }, 
            { make: 'Nissan', model: 'Rogue' }, { make: 'Hyundai', model: 'Elantra' }, { make: 'Tesla', model: 'Model Y' },
            { make: 'Chevrolet', model: 'Malibu' }, { make: 'Subaru', model: 'Forester' }
        ];
        const randomStatus = statuses[i % statuses.length];
        const randomCustomer = customers[i % customers.length];
        const randomCar = cars[i % cars.length];
        const jobDate = new Date();
        jobDate.setDate(jobDate.getDate() - (i % 15)); // Keep dates within the current month (June 2026)
        
        const job: Job = {
            id: `JOB-MOCK${String(i + 1).padStart(3, '0')}`,
            customerEmail: randomCustomer,
            shop: mockShops[i % mockShops.length], // Alternate among all defined shops
            carDetails: { make: randomCar.make, model: randomCar.model, year: (2020 + i % 6).toString(), vin: `1MOCKVIN${i}AUTOFIX`, registrationNo: `MCK-${200 + i}` },
            photos: { damage: [], inProgress: [], completed: [] },
            status: randomStatus,
            lastUpdate: jobDate.toISOString(),
            chatHistory: [],
            bookingDate: jobDate.toISOString().split('T')[0],
            assignedStaff: [mockStaff[i % mockStaff.length]]
        };

        if (randomStatus !== 'New' && randomStatus !== 'Estimate' && randomStatus !== 'Cancelled') {
            job.quote = { items: [{ description: 'Auto Body Repair & Refinishing Service', quantity: 1, price: 150 + i * 40 }], total: 150 + i * 40 };
        }
        if (randomStatus === 'Completed' || randomStatus === 'Awaiting Payment') {
             const subtotal = job.quote!.total;
             const tax = subtotal * 0.08;
             job.invoice = { id: `INV-MOCK${String(i + 1).padStart(3, '0')}`, date: jobDate.toISOString().split('T')[0], items: job.quote!.items, subtotal, tax, total: subtotal + tax };
        }
        if (randomStatus === 'Completed') {
            job.rating = (i % 3) + 3; // 3 to 5 stars
            job.reviewText = "Highly satisfied with the repair alignment and prompt customer support response times.";
        }
        return job;
    })
];


const initialSupportTickets: SupportTicket[] = [
    { 
        id: 'TICKET-001', 
        customerEmail: 'customer@example.com', 
        subject: 'Invoice Tax & Labor Hours Breakdown Discrepancy', 
        status: 'Open', 
        lastUpdate: new Date().toISOString(), 
        chatHistory: [
            { id: 'sup-1', sender: 'customer', text: 'Hi, looking at my invoice INV-MOCK1, the labor hour calculation for structural frame pulling seems to overlap with standard bumper removal. Could you verify if double labor hours were logged by mistake?', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
            { id: 'sup-2', sender: 'admin', text: 'Hello! I can definitely help investigate that. I will query the bodytech logs for the alignment rack and crosscheck state service rate guides. One second please.', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-002', 
        customerEmail: 'another.user@example.com', 
        subject: 'Sandbox Payment Gateways - Card Declined Code 402', 
        status: 'Closed', 
        lastUpdate: new Date(Date.now() - 86400000 * 2).toISOString(), 
        chatHistory: [
            { id: 'sup-3', sender: 'customer', text: 'My test credit card keeps getting declined with error code 402 during the checkout process for JOB-002.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: 'sup-3-reply', sender: 'admin', text: 'Hello, for sandbox testing please make sure to use standard testing credentials. Code 402 is simulated for expired tokens. Please click auto-settle or clear local storage to reset your test credentials.', timestamp: new Date(Date.now() - 86400000 * 1.9).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-003', 
        customerEmail: 'test.user@example.com', 
        subject: 'Rescheduling Frame Puller Slot for Job #BCONF', 
        status: 'In Progress', 
        lastUpdate: new Date(Date.now() - 86400000).toISOString(), 
        chatHistory: [
            { id: 'sup-4', sender: 'customer', text: 'Is it possible to reschedule my appointment for JOB-BCONF? My insurance adjuster needs 2 more days to inspect the frame measurements remotely.', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 'sup-4-a', sender: 'admin', text: 'Got it, we can defer the frame alignment rack booking. Note that we have moved your slot to next Thursday. Let us know if the surveyor accepts that slot!', timestamp: new Date(Date.now() - 40000000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-004', 
        customerEmail: 'new.customer@example.com', 
        subject: 'BMW 3-Series Bumper Paint Match Question', 
        status: 'Open', 
        lastUpdate: new Date().toISOString(), 
        chatHistory: [
            { id: 'sup-5', sender: 'customer', text: 'Hi, does your paint shop use the original manufacturer Alpine White paint code (code 300) or do you manually color blend?', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-005', 
        customerEmail: 'jane.doe@example.com', 
        subject: 'Praise for AI Bumper Scratch Estimate Accuracy', 
        status: 'Closed', 
        lastUpdate: new Date(Date.now() - 86400000 * 5).toISOString(), 
        chatHistory: [
            { id: 'sup-6', sender: 'customer', text: 'Just wanted to submit feedback! The Gemini multimodal photo estimator gave me a quote that was within $50 of the real body shop invoice. Unbelievable precision!', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
            { id: 'sup-6-b', sender: 'admin', text: 'Thank you Jane! We continuously feed anonymized collision models and regional labor standards directly into Gemini. We love to hear this!', timestamp: new Date(Date.now() - 86400000 * 4.9).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-006', 
        customerEmail: 'mike.jones@example.com', 
        subject: 'Technician Login Credentials - Reset Profile', 
        status: 'Closed', 
        lastUpdate: new Date(Date.now() - 86400000 * 3).toISOString(), 
        chatHistory: [
            { id: 'sup-7', sender: 'customer', text: 'Hi admin, this is Mike of Downtown Auto Body. My painter lost his password and cannot check off paint phases. Can you reset code for user mike.jones?', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
            { id: 'sup-7-a', sender: 'admin', text: 'Password reset links sent directly to registered email. For immediate security overrides you can also click the quick credentials in the Sandbox Modal on the home screen.', timestamp: new Date(Date.now() - 86400000 * 2.9).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-007', 
        customerEmail: 'david.lee@example.com', 
        subject: 'Estimate Review: Camry Rear Bumper Cover Refinish', 
        status: 'Open', 
        lastUpdate: new Date().toISOString(), 
        chatHistory: [
            { id: 'sup-8', sender: 'customer', text: 'Can someone re-check the automatically generated bumper quote for my Camry? It says 4.5 hours for structural sanding, but the bumper is just scratched, no structural cracking.', timestamp: new Date(Date.now() - 900000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-008', 
        customerEmail: 'emily.chen@example.com', 
        subject: 'Tesla Structural Aluminum Sourcing Delay', 
        status: 'In Progress', 
        lastUpdate: new Date(Date.now() - 86400000).toISOString(), 
        chatHistory: [
            { id: 'sup-9', sender: 'customer', text: 'The parts ledger has been showing my Tesla alloy subframe in "Ordered" status for over 5 days. Are there any shipping blockages or should we source recycled parts?', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 'sup-9-reply', sender: 'admin', text: 'Hello Emily. Tesla OEM aluminum requires certified freight carriers. We checked with our supplier and it is currently in custom clearance. We expect delivery to the shop by tomorrow afternoon.', timestamp: new Date(Date.now() - 40000000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-009', 
        customerEmail: 'frank.wright@example.com', 
        subject: 'Praise: Outstanding Alignment Work on Ford F-150', 
        status: 'Closed', 
        lastUpdate: new Date(Date.now() - 86400000 * 6).toISOString(), 
        chatHistory: [
            { id: 'sup-10', sender: 'customer', text: 'Outstanding alignment work from the service team. Truck drives and tracks dead straight now, and the invoice was extremely clean.', timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
            { id: 'sup-10-rep', sender: 'admin', text: 'Thank you Frank! We appreciate your patronage. Enjoy the road!', timestamp: new Date(Date.now() - 86400000 * 5.9).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-010', 
        customerEmail: 'grace.hall@example.com', 
        subject: 'Request: Headlight Restoration on Current Active Repair', 
        status: 'Open', 
        lastUpdate: new Date().toISOString(), 
        chatHistory: [
            { id: 'sup-11', sender: 'customer', text: 'While my car is already in the paint booth for the fender correction, could the shop team also polish the cloudy polycarbonate headlights and lay clearcoat over them? Let me know how much extra that adds.', timestamp: new Date(Date.now() - 100000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-011', 
        customerEmail: 'customer@example.com', 
        subject: 'Inquiry: Advanced ADAS Calibration Equipment', 
        status: 'Open', 
        lastUpdate: new Date().toISOString(), 
        chatHistory: [
            { id: 'sup-12', sender: 'customer', text: 'When re-hooking the front radar sensors of my Tesla, does your team use laser-guided digital ADAS boards or static target stands?', timestamp: new Date(Date.now() - 50000).toISOString() }
        ] 
    },
    { 
        id: 'TICKET-012', 
        customerEmail: 'isabella.ward@example.com', 
        subject: 'Feedback: Immaculate paint-match on Mazda Soul Red', 
        status: 'Closed', 
        lastUpdate: new Date(Date.now() - 86400000).toISOString(), 
        chatHistory: [
            { id: 'sup-13', sender: 'customer', text: 'Mazda Soul Red Crystal is notoriously impossible to paint match without factory robotic layering. You guys hit it 100% perfectly. Amazing color spectrum blending!', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 'sup-13-reply', sender: 'admin', text: 'Thank you Isabella! We utilize multi-stage computerized spectrophotometer scans and premium urethane pigments to replicate that depth. Thrilled you love the result!', timestamp: new Date(Date.now() - 80000000).toISOString() }
        ] 
    }
];

const getInitialSettings = (): AppSettings => {
    try {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // Basic validation to ensure the object is what we expect
            if (parsed && typeof parsed.theme === 'string' && typeof parsed.fontSize === 'string') {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Could not parse settings from localStorage, using defaults.", error);
    }
    
    // Fallback to system preference if nothing valid is in localStorage
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
        theme: prefersDark ? 'dark' : 'light',
        fontSize: 'md'
    };
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  
  // Main Data State
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Apply theme and font size and save to localStorage
    const root = window.document.documentElement;

    // Theme
    const effectiveTheme = settings.theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Font Size
    if (settings.fontSize === 'sm') {
        root.style.fontSize = '14px';
    } else if (settings.fontSize === 'lg') {
        root.style.fontSize = '18px';
    } else { // md
        root.style.fontSize = '16px';
    }
    
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }


    // Optional: Listen for system theme changes to update UI if theme is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (settings.theme === 'system') {
            // Re-trigger the effect to apply the new system theme
            setSettings(s => ({ ...s })); 
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

}, [settings]);


  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleLogin = (email: string) => {
    let role: UserRole = 'customer';
    if (email.startsWith('shop')) role = 'shop';
    else if (email.startsWith('admin')) role = 'admin';
    setUser({ email, role });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => setUser(null);

  const updateJob = (jobId: string, updates: Partial<Job>) => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates, lastUpdate: new Date().toISOString() } : j));
  };
  
  const handleCreateNewJob = (jobDetails: Omit<Job, 'id' | 'lastUpdate' | 'chatHistory'>) => {
    const newJob: Job = {
        ...jobDetails,
        id: `JOB-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        lastUpdate: new Date().toISOString(),
        chatHistory: [{ id: `sys-${Date.now()}`, sender: 'system', text: `Job created and sent to ${jobDetails.shop.name}.`, timestamp: new Date().toISOString() }],
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };
  
  const handleGetAIQuote = (jobDetails: Omit<Job, 'id' | 'status' | 'lastUpdate' | 'chatHistory' | 'aiAnalysis'>, aiAnalysis: AIAnalysisResult) => {
    const newJob: Job = {
        ...jobDetails,
        id: `JOB-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        status: 'Estimate',
        aiAnalysis,
        lastUpdate: new Date().toISOString(),
        chatHistory: [{ id: `sys-${Date.now()}`, sender: 'system', text: `AI Estimate created.`, timestamp: new Date().toISOString() }],
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };
  
   const handleProvideQuote = (jobId: string, quote: ManualQuote) => {
    updateJob(jobId, { quote, status: 'Quote Provided' });
    handleSendChatMessage(jobId, 'A quote has been prepared for you. Please review and book an appointment.', 'shop', false);
  };

  const handleSendChatMessage = (jobId: string, messageText: string, sender: ChatMessage['sender'], simulateReply: boolean = true) => {
    const newMessage: ChatMessage = { id: `msg-${Date.now()}`, sender, text: messageText, timestamp: new Date().toISOString() };
     setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        const updatedHistory = [...job.chatHistory, newMessage];
        if (simulateReply && sender !== 'system') {
            const roleReply = sender === 'customer' ? 'shop' : 'customer';
            const replyText = sender === 'customer' 
                ? `Hi from ${job.shop.name}! Thanks, we received your message and will reply soon.`
                : `Got it, thanks for the update!`;
            
            setTimeout(() => {
                const replyMessage: ChatMessage = { id: `msg-${Date.now()+1}`, sender: roleReply, text: replyText, timestamp: new Date().toISOString() };
                setJobs(currentJobs => currentJobs.map(j => j.id === jobId ? {...j, chatHistory: [...j.chatHistory, replyMessage]} : j));
            }, 2000);
        }
        return { ...job, chatHistory: updatedHistory };
      }
      return job;
    }));
  };
  
  const handleSendSupportMessage = (ticketId: string, messageText: string, sender: 'customer' | 'admin') => {
      setSupportTickets(prev => prev.map(ticket => {
          if (ticket.id === ticketId) {
              const newMessage: ChatMessage = { id: `sup-${Date.now()}`, sender, text: messageText, timestamp: new Date().toISOString() };
              const updatedHistory = [...ticket.chatHistory, newMessage];
               if (sender === 'customer') {
                    setTimeout(() => {
                        const reply: ChatMessage = {
                            id: `sup-reply-${Date.now()}`,
                            sender: 'admin',
                            text: "Thanks for your message. An agent will be with you shortly.",
                            timestamp: new Date().toISOString(),
                        };
                        setSupportTickets(current => current.map(t => t.id === ticketId ? {...t, chatHistory: [...t.chatHistory, reply]} : t));
                    }, 1500);
                }
              return { ...ticket, chatHistory: updatedHistory, lastUpdate: new Date().toISOString() };
          }
          return ticket;
      }));
  };
  
  const handleGenerateInvoice = (jobId: string) => {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      const items: InvoiceItem[] = job.quote?.items || [{description: 'General Repair', quantity: 1, price: 500}]; // fallback
      const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      const newInvoice: Invoice = {
          id: `INV-${job.id.slice(4)}`,
          date: new Date().toISOString().split('T')[0],
          items,
          subtotal,
          tax,
          total,
      };

      updateJob(jobId, { invoice: newInvoice, status: 'Awaiting Payment' });
  };


  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
     updateJob(jobId, { status });
  };
  
  const handleUpdateShop = (shopId: number, updates: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...updates } : s));
  };
  
  const handleUpdateJobClientDetails = (jobId: string, clientDetails: ClientDetails) => {
    updateJob(jobId, { clientDetails });
  };
  
  const handleUpdateJobPhotos = (jobId: string, category: 'damage' | 'inProgress' | 'completed', photos: string[]) => {
      setJobs(prev => prev.map(j => {
          if (j.id === jobId) {
              const newPhotos = { ...j.photos, [category]: photos };
              return { ...j, photos: newPhotos };
          }
          return j;
      }));
  };
  
  const handleUpdateJobStaff = (jobId: string, staff: StaffMember[]) => {
      updateJob(jobId, { assignedStaff: staff });
  };
  
  const handleUpdateJobParts = (jobId: string, parts: Part[]) => {
    updateJob(jobId, { parts });
  };
  
  const handleUpdateJobNotes = (jobId: string, notes: string) => {
    updateJob(jobId, { notes });
  };
  
  const renderPortal = () => {
    if (!user) {
        return <LandingPage onLoginClick={() => setIsAuthModalOpen(true)} />;
    }
    
    switch(user.role) {
        case 'customer':
            return <CustomerPortal
                user={user}
                onLogout={handleLogout}
                jobs={jobs.filter(j => j.customerEmail === user.email)}
                shops={shops.filter(s => s.status === 'Approved')}
                onNewJob={handleCreateNewJob}
                onNewAIQuote={handleGetAIQuote}
                onSendChatMessage={(jobId, msg) => handleSendChatMessage(jobId, msg, 'customer')}
                onPayment={(jobId) => {
                    updateJob(jobId, { status: 'Completed' });
                    handleSendChatMessage(jobId, 'Payment confirmed. Thank you!', 'system', false);
                }}
                onReview={(jobId, rating, review) => updateJob(jobId, { rating, reviewText: review })}
                supportTickets={supportTickets.filter(t => t.customerEmail === user.email)}
                onSendSupportMessage={(ticketId, msg) => handleSendSupportMessage(ticketId, msg, 'customer')}
                onAcceptQuote={(jobId, bookingDate) => {
                    updateJob(jobId, { bookingDate, status: 'Booking Confirmed' });
                    handleSendChatMessage(jobId, 'Booking confirmed! We look forward to seeing you.', 'shop', false);
                }}
                onDeclineQuote={(jobId) => updateJob(jobId, { status: 'Cancelled' })}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
            />;
        case 'shop':
            const shopUserEmailMap: { [key: string]: number } = {
                'shop@example.com': 1,
                'shop2@example.com': 2
            };
            const shopId = shopUserEmailMap[user.email] || 1; // Default to shop 1
            const shopForPortal = shops.find(s => s.id === shopId);
            if (!shopForPortal) return <div>Error: Shop Not Found</div>;
            
            return <ShopPortal 
                user={user} 
                onLogout={handleLogout}
                jobs={jobs.filter(j => j.shop.id === shopId)}
                shop={shopForPortal}
                onProvideQuote={handleProvideQuote}
                onSendChatMessage={(jobId, msg) => handleSendChatMessage(jobId, msg, 'shop')}
                onUpdateJobStatus={handleUpdateJobStatus}
                onGenerateInvoice={handleGenerateInvoice}
                onUpdateShop={(updates) => handleUpdateShop(shopId, updates)}
                onUpdateClientDetails={handleUpdateJobClientDetails}
                onUpdatePhotos={handleUpdateJobPhotos}
                onUpdateStaff={handleUpdateJobStaff}
                onUpdateParts={handleUpdateJobParts}
                onUpdateNotes={handleUpdateJobNotes}
                onUpdateJobBookingDate={(jobId, bookingDate) => updateJob(jobId, { bookingDate })}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
            />;
        case 'admin':
            return <AdminPortal 
                user={user} 
                onLogout={handleLogout}
                jobs={jobs}
                shops={shops}
                supportTickets={supportTickets}
                onSendSupportMessage={(ticketId, msg) => handleSendSupportMessage(ticketId, msg, 'admin')}
                onUpdateShop={handleUpdateShop}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
            />;
        default:
            return <div className="text-center p-8">Invalid user role.</div>;
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <NotificationProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans">
        <main>
            {renderPortal()}
        </main>
        {isAuthModalOpen && (
            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLogin}
            />
        )}
        <ToastContainer />
        </div>
    </NotificationProvider>
  );
};

export default App;