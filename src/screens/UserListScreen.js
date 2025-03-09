import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUsers, deleteUser} from '../redux/userSlice';
import UserModal from '../components/UserFormModal';
import CommonBackground from '../components/CommonBackground';
const UserListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {users, status, error, page, hasMore} = useSelector(
    state => state.users,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  const handleEditUser = user => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const handleDeleteUser = id => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteUser(id)),
        },
      ],
      {cancelable: true},
    );
  };

  const handleDetails = id => {
    navigation.navigate('UserDetailScreen', {userId: id});
  };

  // Load next page when "Load More" is pressed
  const handleLoadMore = () => {
    if (status !== 'loading' && hasMore) {
      dispatch(fetchUsers(page + 1));
    }
  };

  // For the initial load, show a spinner.
  if (status === 'loading' && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D863CE" />
      </View>
    );
  }

  // For initial error
  if (status === 'failed' && page === 1) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <CommonBackground>
      <View style={styles.overlay}>
        {/* Removed custom header since navigation header already shows "Users" */}
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userDetail}>📧 {item.email}</Text>
                <Text style={styles.userDetail}>📞 {item.phone}</Text>
                <Text style={styles.userDetail}>🏢 {item.company?.name}</Text>
                <Text style={styles.userDetail}>
                  📍 {item.address?.city}, {item.address?.street}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditUser(item)}>
                  <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteUser(item.id)}>
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDetails(item.id)}>
                  <Text style={styles.actionText}>🔍</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}>
                {status === 'loading' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            )
          }
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.addButtonText}>➕ Add a New User</Text>
        </TouchableOpacity>
        <UserModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          user={selectedUser}
        />
      </View>
    </CommonBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 25,
    marginVertical: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6f61',
    fontSize: 18,
  },
  loadMoreButton: {
    backgroundColor: '#DC84DD',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default UserListScreen;
