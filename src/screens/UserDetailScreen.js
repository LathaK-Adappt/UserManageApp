import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import UserModal from '../components/UserFormModal';

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Pass userId instead of user object
  const user = useSelector((state) => state.users.users.find((u) => u.id === userId)); // Get the updated user from Redux
  const [modalVisible, setModalVisible] = useState(false);

  if (!user) return <Text style={styles.errorText}>User not found</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>📧 {user.email}</Text>
        <Text style={styles.userInfo}>📞 {user.phone}</Text>
        <Text style={styles.userInfo}>🏢 {user.company?.name}</Text>
        <Text style={styles.userInfo}>📍 {user.address?.city}, {user.address?.street}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>⬅ Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>

      {/* User Modal for Editing */}
      <UserModal visible={modalVisible} onClose={() => setModalVisible(false)} user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 10,
    fontWeight: '500',
  },
  userInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  backButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserDetailScreen;
