import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUsers, deleteUser} from '../redux/userSlice';
import UserModal from '../components/UserFormModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {users, status, error} = useSelector(state => state.users);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users on mount
  }, [dispatch]);

  const handleEditUser = user => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null); // Clear selected user to prevent editing behavior
    setModalVisible(true);
  };

  const handleDeleteUser = id => {
    dispatch(deleteUser(id));
  };

  const handleDetails = id => {
    navigation.navigate('UserDetailScreen', {userId: id});
  };
  // Display loading spinner if the status is "loading"
  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Display error message if the status is "failed"
  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>📧 {item.email}</Text>
            <Text style={styles.userInfo}>📞 {item.phone}</Text>
            <Text style={styles.userInfo}>🏢 {item.company?.name}</Text>
            <Text style={styles.userInfo}>
              📍 {item.address?.city}, {item.address?.street}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditUser(item)}>
                <Text style={styles.buttonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteUser(item.id)}>
                <Text style={styles.buttonText}>🗑 Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleDetails(item.id)}>
                <Text style={styles.buttonText}>🔍 Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddUser()}>
        <Text style={styles.addButtonText}>➕ Add User</Text>
      </TouchableOpacity>

      {/* User Modal */}
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={selectedUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f8f9fa'},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  userName: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  userEmail: {fontSize: 14, color: '#555', marginBottom: 5},
  userInfo: {fontSize: 14, color: '#666', marginBottom: 3},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#17a2b8',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default UserListScreen;
