import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Picker } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CreateTicketScreen({ navigation }: { navigation: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const { token } = useAuth();

  const handleCreateTicket = async () => {
    try {
      const response = await fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Ticket created!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create ticket');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Ticket</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Picker
        selectedValue={priority}
        onValueChange={setPriority}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="LOW" />
        <Picker.Item label="Medium" value="MEDIUM" />
        <Picker.Item label="High" value="HIGH" />
        <Picker.Item label="Urgent" value="URGENT" />
      </Picker>
      <Button title="Crear" onPress={handleCreateTicket} />
      <Button title="Cancelar" onPress={() => navigation.goBack()} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 20,
  },
});
