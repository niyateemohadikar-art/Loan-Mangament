import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateEMISchedulePDF = (loan, emiSchedule) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Loan Management', 105, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('EMI Schedule Statement', 105, 30, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 38, { align: 'center' });

  // Loan details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Loan Details', 14, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const details = [
    [`Loan ID: #${loan.id}`, `Loan Type: ${loan.loan_type?.toUpperCase()}`],
    [`Loan Amount: ₹${Number(loan.loan_amount).toLocaleString('en-IN')}`, `Interest Rate: ${loan.interest_rate}% p.a.`],
    [`Tenure: ${loan.tenure_months} months`, `Monthly EMI: ₹${Number(loan.monthly_emi).toLocaleString('en-IN')}`],
    [`Total Interest: ₹${Number(loan.total_interest).toLocaleString('en-IN')}`, `Total Amount: ₹${Number(loan.total_amount).toLocaleString('en-IN')}`],
  ];
  
  let y = 63;
  details.forEach(row => {
    doc.text(row[0], 14, y);
    doc.text(row[1], 110, y);
    y += 7;
  });

  // EMI Table
  const tableData = emiSchedule.map(emi => [
    emi.emi_number,
    new Date(emi.due_date).toLocaleDateString('en-IN'),
    `₹${Number(emi.emi_amount).toLocaleString('en-IN')}`,
    `₹${Number(emi.principal_component).toLocaleString('en-IN')}`,
    `₹${Number(emi.interest_component).toLocaleString('en-IN')}`,
    `₹${Number(emi.outstanding_balance).toLocaleString('en-IN')}`,
    emi.payment_status.toUpperCase(),
  ]);

  doc.autoTable({
    startY: y + 5,
    head: [['#', 'Due Date', 'EMI', 'Principal', 'Interest', 'Balance', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 12 },
      6: { fontStyle: 'bold' },
    },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Smart Loan Lifecycle Management System - Confidential', 105, 290, { align: 'center' });
  }

  doc.save(`EMI_Schedule_Loan_${loan.id}.pdf`);
};

export const generatePaymentReceiptPDF = (payment, loan) => {
  const doc = new jsPDF();
  
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Receipt', 105, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Smart Loan Management System', 105, 30, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  
  const info = [
    ['Receipt No:', `#PAY-${payment.id}`],
    ['Date:', new Date(payment.payment_date).toLocaleDateString('en-IN')],
    ['Loan ID:', `#${payment.loan_id}`],
    ['Amount Paid:', `₹${Number(payment.amount).toLocaleString('en-IN')}`],
    ['Payment Method:', payment.payment_method || 'Online'],
    ['Transaction ID:', payment.transaction_id || payment.stripe_payment_id || 'N/A'],
    ['Status:', payment.payment_status?.toUpperCase()],
  ];

  let y = 55;
  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, y);
    y += 10;
  });

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, y + 5, 190, y + 5);
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('This is a computer-generated receipt. No signature required.', 105, y + 15, { align: 'center' });

  doc.save(`Payment_Receipt_${payment.id}.pdf`);
};

export const generateSanctionLetterPDF = (loan, user) => {
  const doc = new jsPDF();
  
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Loan Sanction Letter', 105, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Smart Loan Management System', 105, 30, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  let y = 55;
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, y);
  y += 10;
  doc.text(`Ref: SLMS/SANCTION/${loan.id}/${new Date().getFullYear()}`, 14, y);
  y += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Dear ${user?.name || 'Borrower'},`, 14, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  const text = `We are pleased to inform you that your ${loan.loan_type} loan application has been sanctioned. The details of the sanctioned loan are as follows:`;
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 14, y);
  y += lines.length * 7 + 10;

  const details = [
    ['Loan Amount:', `₹${Number(loan.loan_amount).toLocaleString('en-IN')}`],
    ['Interest Rate:', `${loan.interest_rate}% per annum`],
    ['Tenure:', `${loan.tenure_months} months`],
    ['Monthly EMI:', `₹${Number(loan.monthly_emi).toLocaleString('en-IN')}`],
    ['Total Interest:', `₹${Number(loan.total_interest).toLocaleString('en-IN')}`],
    ['Total Repayment:', `₹${Number(loan.total_amount).toLocaleString('en-IN')}`],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, y);
    y += 8;
  });

  y += 10;
  doc.text('Please note that this sanction is subject to our standard terms and conditions.', 14, y);
  y += 15;
  doc.text('Yours sincerely,', 14, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Loan Management System', 14, y);

  doc.save(`Sanction_Letter_Loan_${loan.id}.pdf`);
};
