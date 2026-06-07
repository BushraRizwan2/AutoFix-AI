
import React from 'react';
import { Job } from '../types';

export const PrintableInvoice: React.FC<{ job: Job }> = ({ job }) => {
    if (!job.invoice) return null;
    const { invoice, shop, carDetails, clientDetails } = job;
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div style={{ fontFamily: 'sans-serif', color: '#111827', padding: '2rem' }}>
            <style>
                {`
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                `}
            </style>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: 0, color: '#4f46e5' }}>INVOICE</h1>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>Invoice #: {invoice.id}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>Date: {new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, textAlign: 'right' }}>{shop.name}</h2>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', textAlign: 'right' }}>{shop.address}</p>
                    {shop.phone && <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', textAlign: 'right' }}>{shop.phone}</p>}
                </div>
            </header>

            <section style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}>Bill To</h3>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{clientDetails?.name || job.customerEmail}</p>
                    {clientDetails?.address && <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563' }}>{clientDetails.address}</p>}
                </div>
                <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}>Vehicle</h3>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{`${carDetails.year} ${carDetails.make} ${carDetails.model}`}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563' }}>Rego: {carDetails.registrationNo}</p>
                </div>
            </section>

            <section style={{ marginTop: '2.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f3f4f6' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Unit Price</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{item.description}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#4b5563' }}>{formatCurrency(item.price)}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', maxWidth: '20rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#4b5563' }}>Subtotal:</span>
                        <span>{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#4b5563' }}>Tax (8%):</span>
                        <span>{formatCurrency(invoice.tax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', paddingTop: '0.75rem', borderTop: '2px solid #e5e7eb', marginTop: '0.5rem' }}>
                        <span>Total:</span>
                        <span style={{ color: '#4f46e5' }}>{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
