import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import CryptoJS from 'crypto-js';
import './psummary.css'; // Ensure to update your CSS file with the necessary styles

const PSummary = () => {
  const location = useLocation();
  const { prescriptionId } = location.state || {};

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prescriptionId) {
      setError('Prescription ID not available.');
      setLoading(false);
      return;
    }

    const fetchPrescription = async () => {
      try {
        const docRef = doc(db, 'prescriptions', prescriptionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const decryptedPrescription = {
            id: docSnap.id,
            doctor: {
              doctorName: CryptoJS.AES.decrypt(data.doctor.doctorName, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
              biography: CryptoJS.AES.decrypt(data.doctor.biography, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
              phoneNumber: CryptoJS.AES.decrypt(data.doctor.phoneNumber, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8)
            },
            patient: CryptoJS.AES.decrypt(data.patient, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
            prescriptionDate: new Date(data.createdDate).toLocaleDateString(),
            diagnosis: CryptoJS.AES.decrypt(data.diagnosis, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
            note: CryptoJS.AES.decrypt(data.note, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
            appointmentNo: CryptoJS.AES.decrypt(data.appointmentNo, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
            nicNo: prescriptionId, // Assuming prescriptionId as NIC
            medicines: data.medicines.map(med => ({
              medicineName: CryptoJS.AES.decrypt(med.medicineName, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
              instruction: CryptoJS.AES.decrypt(med.instruction, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
              days: CryptoJS.AES.decrypt(med.days, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8),
            })),
            createdDate: data.createdDate
          };

          setPrescription(decryptedPrescription);
        } else {
          setError('No such prescription found.');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescription:", error);
        setError('Error fetching prescription: ' + error.message);
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  return (
    <div className="prescription-container">
      <div className='pretitle'>
        <h2>Prescription </h2>
      </div>
      <div className="prescription-card">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : prescription ? (
          <>
            <header className="headerpre">
              <div className="doctor-info">
                <h2>{prescription.doctor.doctorName}</h2>
                <p>M.B.B.S., M.D., M.S. | Reg. No: D07</p> {/* Update as needed */}
                <p>Mob. No: {prescription.doctor.phoneNumber}</p>
              </div>
              <div className="clinic-logo">
                <span>MediConnect</span>
              </div>
            </header>

            <div className="patient-info">
              <div className="patient-details">
                <p><strong>ID: {prescription.nicNo}</strong> - {prescription.patient}</p>
                <p>Address: Kandy</p> {/* Update as needed */}
                <p>Temp (deg): 36, BP: 120/80 mmHg</p> {/* Update as needed */}
              </div>
              <div className="prescription-meta">
                <p>Patient Name: {prescription.patient}</p>
                <p>Reference No: {prescriptionId}</p>
                <p>Date: {prescription.prescriptionDate}</p>
              </div>
            </div>

            <h4>Medicines Prescribed:</h4>
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, index) => (
                  <tr key={index}>
                    <td>{med.medicineName}</td>
                    <td>{med.instruction}</td>
                    <td>{med.days} days</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="advice">
              <strong>Advice Given:</strong>
              <p>* AVOID OILY AND SPICY FOOD</p> {/* Update dynamically if needed */}
              <p>Follow Up: 8-Nov-2024</p> {/* Update as needed */}
            </div>

            <footer className="footer">
              <p>{prescription.doctor.doctorName}</p>
              <p>M.B.B.S., M.D., M.S.</p> {/* Update as needed */}
            </footer>
          </>
        ) : (
          <p>No prescriptions available for this patient.</p>
        )}
      </div>
    </div>
  );
};

export default PSummary;
