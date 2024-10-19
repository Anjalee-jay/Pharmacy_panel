import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'; // Add doc and setDoc for updating Firebase
import { db } from '../firebase-config'; // Ensure correct path to firebase config
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import CryptoJS from 'crypto-js'; // Import CryptoJS
import './Prescription_pharmacy.css'; // Make sure to import CSS

function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const encryptionKey = process.env.REACT_APP_SECRET_KEY;
  const navigate = useNavigate(); // Initialize navigate

  const decryptPrescriptionData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        console.error("Decryption failed: No decrypted text found");
        return 'Unknown'; // Return 'Unknown' for failed decryption
      }

      return decryptedText;
    } catch (error) {
      console.error("Error decrypting data:", error);
      return 'Unknown'; // Return 'Unknown' on error
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'prescriptions'));
      const prescriptionsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const decryptedPrescription = {
          id: doc.id, 
          doctor: {
            doctorName: decryptPrescriptionData(data.doctor.doctorName),
            biography: decryptPrescriptionData(data.doctor.biography),
          },
          patient: decryptPrescriptionData(data.patient),
          prescriptionDate: decryptPrescriptionData(data.prescriptionDate),
          diagnosis: decryptPrescriptionData(data.diagnosis),
          note: decryptPrescriptionData(data.note),
          appointmentNo: decryptPrescriptionData(data.appointmentNo),
          referenceNo: data.referenceNo, // Directly take referenceNo from Firebase without decryption
          nicNo: decryptPrescriptionData(data.nicNo), // Decrypt nicNo
          medicines: data.medicines.map((med) => ({
            medicineName: decryptPrescriptionData(med.medicineName),
            instruction: decryptPrescriptionData(med.instruction),
            days: decryptPrescriptionData(med.days),
          })),
          createdDate: data.createdDate,
          completed: false // Add completed field
        };

        prescriptionsData.push(decryptedPrescription);
      });

      setPrescriptions(prescriptionsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError('Error fetching prescriptions: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearch = () => {
    const searchText = searchQuery.toLowerCase();

    const filtered = prescriptions.filter((prescription) => {
      return (
        (prescription.patient?.toLowerCase() || '').includes(searchText) ||
        (prescription.referenceNo?.toLowerCase() || '').includes(searchText) ||
        (prescription.appointmentNo?.toLowerCase() || '').includes(searchText) ||
        (prescription.nicNo?.toLowerCase() || '').includes(searchText) ||
        (prescription.id.toLowerCase() || '').includes(searchText) // Include prescription ID in the search
      );
    });

    setFilteredPrescriptions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, prescriptions]);

  const handleViewPrescription = (prescriptionId) => {
    navigate(`/psummary`, { state: { prescriptionId } }); // Pass prescription ID in state
  };

  // Function to update the status in ConfirmPrescription collection
  const toggleCompleted = async (id, isCompleted) => {
    try {
      const prescriptionRef = doc(db, 'ConfirmPrescription', id); // Reference to the document in ConfirmPrescription collection

      // Update or add the prescription with the new completed status
      await setDoc(prescriptionRef, { Action: isCompleted ? 'Completed' : 'Not Completed' });

      // Update the local state to reflect the change in the UI
      setFilteredPrescriptions((prev) =>
        prev.map((prescription) =>
          prescription.id === id
            ? { ...prescription, completed: !prescription.completed }
            : prescription
        )
      );
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="prescriptions-list">
      <h2>Prescriptions List</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by patient name, reference number, appointment number, NIC, or Prescription ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Prescription ID</th>
            <th>Reference No</th>
            <th>Appointment No</th>
            <th>Patient Name</th>
            <th>NIC</th>
            <th>Prescription</th>
            <th>Action</th> {/* Add a new header for Action */}
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription) => (
            <tr key={prescription.id}>
              <td>{prescription.id}</td> {/* Display Prescription ID */}
              <td>{prescription.referenceNo}</td> {/* Display Reference No */}
              <td>{prescription.appointmentNo}</td> {/* Display Appointment No */}
              <td>{prescription.patient}</td> {/* Display Patient Name */}
              <td>{prescription.nicNo}</td> {/* Display NIC */}
              <td>
                <button onClick={() => handleViewPrescription(prescription.id)}>
                  View Prescription
                </button>
              </td>
              <td>
                <button
                  className={`status-button ${prescription.completed ? 'completed' : ''}`}
                  onClick={() => toggleCompleted(prescription.id, !prescription.completed)}
                >
                  {prescription.completed ? 'Completed' : 'Not Completed'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrescriptionsList;
