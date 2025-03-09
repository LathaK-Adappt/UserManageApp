import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../redux/userSlice';

const UserModal = ({ visible, onClose, user }) => {
  const dispatch = useDispatch();
  
  // State for user details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  
  // State for validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Editing an existing user
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setCompany(user.company?.name || '');
      setCity(user.address?.city || '');
      setStreet(user.address?.street || '');
    } else {
      // Adding a new user (clear fields)
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setCity('');
      setStreet('');
    }
    setErrors({}); // Reset validation errors
  }, [user, visible]); // Ensure reset happens when modal opens
  

  // Validate inputs before submission
  const validateInputs = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!street.trim()) newErrors.street = 'Street is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit action
  const handleSubmit = () => {
    if (!validateInputs()) return;

    const newUser = {
      id: user ? user.id : Math.floor(Math.random() * 1000), // Generate random ID for new user
      name,
      email,
      phone,
      company: { name: company },
      address: { city, street },
    };

    if (user) {
      dispatch(updateUser(newUser)); // Update user
    } else {
      dispatch(addUser(newUser)); // Add new user
    }

    onClose(); // Close modal after saving
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{user ? 'Edit User' : 'Add User'}</Text>

          {/* Name Input */}
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Email Input */}
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Phone Input */}
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Company Input */}
          <TextInput style={styles.input} placeholder="Company" value={company} onChangeText={setCompany} />
          {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

          {/* Address Inputs */}
          <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <TextInput style={styles.input} placeholder="Street" value={street} onChangeText={setStreet} />
          {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 5 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  saveButton: { backgroundColor: '#952E87', padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#B3A8A9', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default UserModal;
