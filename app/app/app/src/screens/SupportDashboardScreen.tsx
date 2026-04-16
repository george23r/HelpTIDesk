import React, { useState, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ticketsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Ticket } from '../types';

export const SupportDashboardScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('OPEN');
  const [isUpdating, setIsUpdating] = useState(false);
  const { logout, user } = useAuth();

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

  useEffect(() => {
    setIsLoading(true);
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setIsFetching(true);
    fetchTickets();
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    setIsUpdating(true);
    try {
      await ticketsAPI.update(selectedTicket.id, {
        status: newStatus,
      });
      
      // Actualizar lista local
      setTickets(
        tickets.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: newStatus as any } : t
        )
      );
      
      setShowModal(false);
      setSelectedTicket(null);
      Alert.alert('Éxito', 'Ticket actualizado correctamente');
      fetchTickets();
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      // Maneja el caso donde message es un array (del ValidationPipe de NestJS)
      let errorMessage = 'No se pudo actualizar el ticket';
      const responseMessage = error.response?.data?.message;
      if (responseMessage) {
        errorMessage = Array.isArray(responseMessage) ? responseMessage[0] : responseMessage;
      }
      Alert.alert('Error', String(errorMessage));
    } finally {
      setIsUpdating(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return '#34C759';
      case 'MEDIUM':
        return '#FFCC00';
      case 'HIGH':
        return '#FF9500';
      case 'URGENT':
        return '#FF3B30';
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
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => {
        setSelectedTicket(item);
        setNewStatus(item.status);
        setShowModal(true);
      }}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{getPriorityLabel(item.priority)}</Text>
        </View>
      </View>

      <Text style={styles.ticketDescription} numberOfLines={2}>
        {item.description || 'Sin descripción'}
      </Text>

      <View style={styles.ticketFooter}>
        <Text style={styles.creatorLabel}>
          De: {item.user?.email || 'Desconocido'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.dateLabel}>
        {new Date(item.createdAt).toLocaleDateString('es-ES')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel de Soporte</Text>
          <Text style={styles.userInfo}>{user?.email}</Text>
        </View>
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
          <Text style={styles.emptyText}>No hay tickets asignados</Text>
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

      {/* Update Ticket Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              disabled={isUpdating}
            >
              <Text style={styles.modalHeaderButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Actualizar Ticket</Text>
            <TouchableOpacity
              onPress={handleUpdateTicket}
              disabled={isUpdating}
            >
              <Text style={[styles.modalHeaderButton, { color: '#007AFF' }]}>
                {isUpdating ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTicket && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.ticketDetails}>
                <Text style={styles.label}>Título</Text>
                <Text style={styles.detailText}>{selectedTicket.title}</Text>

                <Text style={styles.label}>Descripción</Text>
                <Text style={styles.detailText}>
                  {selectedTicket.description || 'Sin descripción'}
                </Text>

                <Text style={styles.label}>Prioridad</Text>
                <Text style={styles.detailText}>
                  {getPriorityLabel(selectedTicket.priority)}
                </Text>

                <Text style={styles.label}>Reportado por</Text>
                <Text style={styles.detailText}>{selectedTicket.user?.email}</Text>

                <Text style={styles.label}>Cambiar Estado</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newStatus}
                    onValueChange={(value) => setNewStatus(String(value))}
                    enabled={!isUpdating}
                    style={styles.picker}
                  >
                    <Picker.Item label="Abierto" value="OPEN" />
                    <Picker.Item label="En Progreso" value="IN_PROGRESS" />
                    <Picker.Item label="Resuelto" value="RESOLVED" />
                    <Picker.Item label="Cerrado" value="CLOSED" />
                  </Picker>
                </View>
              </View>
            </ScrollView>
          )}
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
  userInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 8,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 8,
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
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  creatorLabel: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 11,
    color: '#bbb',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalHeaderButton: {
    fontSize: 14,
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
  ticketDetails: {
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 200,
  },
});
