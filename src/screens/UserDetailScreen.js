import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import UserModal from '../components/UserFormModal';
import CommonBackground from '../components/CommonBackground';

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const user = useSelector((state) => state.users.users.find((u) => u.id === userId));
  const [modalVisible, setModalVisible] = useState(false);

  if (!user) return <Text style={styles.errorText}>User not found</Text>;

  return (
    <CommonBackground>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>📧 {user.email}</Text>
          <Text style={styles.userInfo}>📞 {user.phone}</Text>
          <Text style={styles.userInfo}>🏢 {user.company?.name}</Text>
          <Text style={styles.userInfo}>
            📍 {user.address?.city}, {user.address?.street}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>⬅ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>
        <UserModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          user={user}
        />
      </View>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    justifyContent: 'space-around',
  },
  backButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#DC84DD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserDetailScreen;
