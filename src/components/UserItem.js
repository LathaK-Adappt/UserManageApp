import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

const UserItem = ({ user, onEdit, onDelete, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{user.name}</Text>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} color="red" />
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
