import { jsPDF } from 'jspdf';
import { PetProfile } from '../types';

export const generatePDF = (profile: PetProfile) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text('Pasaporte de Mascota', 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Nombre: ${profile.name}`, 20, 40);
  doc.text(`Raza: ${profile.breed}`, 20, 50);
  doc.text(`Edad: ${profile.age} años`, 20, 60);
  doc.text(`Descripción: ${profile.description}`, 20, 70);
  
  if (profile.address) {
    doc.text(`Dirección: ${profile.address}`, 20, 80);
  }
  
  doc.setFontSize(16);
  doc.text('Información del Propietario', 20, 95);
  doc.setFontSize(14);
  doc.text(`Nombre: ${profile.owner_name}`, 20, 105);
  doc.text(`Teléfono: ${profile.owner_phone}`, 20, 115);
  doc.text(`Email: ${profile.owner_email}`, 20, 125);
  
  doc.save(`${profile.name}-mascota.pdf`);
};
