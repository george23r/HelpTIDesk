import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface Ticket {
  id: string;
  title: string;
  status: string;
}

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:3000/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets', error);
    }
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {user?.email}</Text>
      <Button title="Crear Ticket" onPress={() => navigation.navigate('CreateTicket')} />
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ticket}>
            <Text>{item.title}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  ticket: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
