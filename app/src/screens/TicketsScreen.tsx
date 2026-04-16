import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ticketsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Ticket } from '../types';

export const TicketsScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });
  const [isCreating, setIsCreating] = useState(false);
  const { logout } = useAuth();

  const fetchTickets = async () => {
    try {
      const response = await ticketsAPI.getAll();
      setTickets(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los tickets');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // useFocusEffect para recargar tickets cuando la pantalla está visible
  React.useEffect(() => {
    setIsLoading(true);
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setIsFetching(true);
    fetchTickets();
  };

  const handleDeleteTicket = async (id: string) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este ticket?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await ticketsAPI.delete(id);
            setTickets(tickets.filter((t) => t.id !== id));
            Alert.alert('Éxito', 'Ticket eliminado');
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el ticket');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleCreateTicket = async () => {
    if (!createFormData.title.trim() || !createFormData.description.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsCreating(true);
    try {
      // Asegura que los datos están en el formato correcto
      const ticketData = {
        title: String(createFormData.title).trim(),
        description: String(createFormData.description).trim(),
        priority: String(createFormData.priority),
      };

      const response = await ticketsAPI.create(ticketData);
      setTickets([response.data, ...tickets]);
      setShowCreateModal(false);
      setCreateFormData({ title: '', description: '', priority: 'MEDIUM' });
      Alert.alert('Éxito', 'Ticket creado correctamente');
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      // Maneja el caso donde message es un array (del ValidationPipe de NestJS)
      let errorMessage = 'No se pudo crear el ticket';
      const responseMessage = error.response?.data?.message;
      if (responseMessage) {
        errorMessage = Array.isArray(responseMessage) ? responseMessage[0] : responseMessage;
      }
      Alert.alert('Error', String(errorMessage));
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro quieres cerrar sesión?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return '#FF3B30';
      case 'IN_PROGRESS':
        return '#FF9500';
      case 'RESOLVED':
        return '#34C759';
      case 'CLOSED':
        return '#8E8E93';
      default:
        return '#666';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      URGENT: 'Urgente',
    };
    return labels[priority] || priority;
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.ticketDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.ticketFooter}>
        <Text style={styles.priorityLabel}>
          Prioridad: {getPriorityLabel(item.priority)}
        </Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteTicket(item.id)}
        >
          <Text style={styles.deleteBtnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Tickets</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : tickets.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay tickets</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createButtonText}>+ Crear Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create Ticket Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              disabled={isCreating}
            >
              <Text style={styles.modalHeaderButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nuevo Ticket</Text>
            <TouchableOpacity
              onPress={handleCreateTicket}
              disabled={isCreating}
            >
              <Text style={[styles.modalHeaderButton, { color: '#007AFF' }]}>
                {isCreating ? 'Creando...' : 'Crear'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.form}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el título del ticket"
                value={createFormData.title}
                onChangeText={(text) =>
                  setCreateFormData({ ...createFormData, title: text })
                }
                editable={!isCreating}
                maxLength={100}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el problema"
                value={createFormData.description}
                onChangeText={(text) =>
                  setCreateFormData({ ...createFormData, description: text })
                }
                multiline
                numberOfLines={6}
                editable={!isCreating}
                maxLength={500}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Prioridad</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={createFormData.priority}
                  onValueChange={(value) => {
                    const priorityValue = String(value); // Asegura que es string
                    setCreateFormData({ ...createFormData, priority: priorityValue });
                  }}
                  enabled={!isCreating}
                  style={styles.picker}
                >
                  <Picker.Item label="Baja" value="LOW" />
                  <Picker.Item label="Media" value="MEDIUM" />
                  <Picker.Item label="Alta" value="HIGH" />
                  <Picker.Item label="Urgente" value="URGENT" />
                </Picker>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: 12,
    color: '#999',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ff5050',
    borderRadius: 4,
  },
  deleteBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalHeaderButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 120,
    minHeight: 120,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 50,
  },
});

