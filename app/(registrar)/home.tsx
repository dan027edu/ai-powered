import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router'; // Import usePathname

const screenWidth = Dimensions.get('window').width;

// Update this to your DigitalOcean Droplet's public IP address
const API_URL = 'http://159.223.53.201/api';

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  classifications: string[];
  description: string;
  uploader_name: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  file_id: string; // Assuming file_id is also part of the document structure
}

const RegistrarHomeScreen = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const [activeTab, setActiveTab] = useState<'pending' | 'in_review' | 'approved' | 'rejected'>('pending');
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      // Use the updated API_URL here
      const response = await fetch(`${API_URL}/documents/`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to load documents. Please try again.');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchText === '' ||
      doc.file_name.toLowerCase().includes(searchText.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = doc.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (documentId: string, newStatus: Document['status']) => {
    try {
      // Use the updated API_URL here
      const response = await fetch(`${API_URL}/documents/${documentId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Status update failed with response:', response.status, errorBody);
        try {
          const errorJson = JSON.parse(errorBody);
           throw new Error(errorJson.error || 'Failed to update document status');
        } catch {
           throw new Error(`Failed to update document status. Status: ${response.status}`);
        }
      }

      fetchDocuments(); // Refresh the list
      Alert.alert('Success', `Document ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating document status:', error);
       let errorMessage = 'An unexpected error occurred';
       if (error instanceof Error) {
           errorMessage = error.message;
       } else if (typeof error === 'string') {
           errorMessage = error;
       }
      Alert.alert('Error', `Failed to update document status: ${errorMessage}`);
    }
  };

  const handleApproveDocument = (documentId: string) => handleStatusUpdate(documentId, 'approved');
  const handleRejectDocument = (documentId: string) => handleStatusUpdate(documentId, 'rejected');
  // Corrected handleReceiveDocument to use documentId
  const handleReceiveDocument = (documentId: string) => handleStatusUpdate(documentId, 'in_review');

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.file_name}</Text>
        <Text style={styles.documentSubtitle}>{item.description || 'No description'}</Text>
        <Text style={styles.documentSubtitle}>Submitted: {new Date(item.uploaded_at).toLocaleDateString()}</Text>

        <View style={styles.documentActions}>
          {activeTab === 'in_review' && (
            <>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push(`/screen/versionhistory`)} // Consider passing document ID here
              >
                <Text style={styles.viewButtonText}>View Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApproveDocument(item.id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRejectDocument(item.id)}
              >
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'pending' && (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleReceiveDocument(item.id)} // Pass item.id here
            >
              <Text style={styles.viewButtonText}>Receive</Text>
            </TouchableOpacity>
          )}

          {(activeTab === 'approved' || activeTab === 'rejected') && (
            <>
              <TouchableOpacity
                style={styles.viewButton}
                 onPress={() => router.push(`/screen/versionhistory`)} // Consider passing document ID here
              >
                <Text style={styles.viewButtonText}>View Document</Text>
              </TouchableOpacity>
              <View style={[styles.statusChip, {
                backgroundColor: activeTab === 'approved' ? '#4CAF50' : '#F44336'
              }]}>
                <Text style={styles.statusText}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')} {/* Added replace for display */}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const getActiveButtonStyle = (routeName: string) => {
    const isActive = pathname.includes(routeName); // Use pathname to check active state
    return {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flex: 1,
      height: 48,
      backgroundColor: isActive ? '#0D2D1D' : 'transparent', // Apply style based on isActive
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/udmaddress.png')}
          style={styles.headerImage}
        />
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push('/screen/notification')}
        >
          <Icon name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Documents..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['pending', 'in_review', 'approved', 'rejected'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Document List */}
      <FlatList
        data={filteredDocuments}
        renderItem={renderDocumentItem}
        keyExtractor={item => String(item.id)} // Explicitly convert id to string
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={getActiveButtonStyle('/(registrar)/home')} // Use route path for highlighting
          activeOpacity={0.7}
          onPress={() => router.push("/(registrar)/home")}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('/(registrar)/search')} // Use route path for highlighting
          activeOpacity={0.7}
          onPress={() => router.push("/(registrar)/search")}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('/(registrar)/upload')} // Use route path for highlighting
          activeOpacity={0.7}
          onPress={() => router.push("/(registrar)/upload")}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('/(registrar)/profile')} // Use route path for highlighting
          activeOpacity={0.7}
          onPress={() => router.push("/(registrar)/profile")}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegistrarHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
  },
  headerContainer: {
    backgroundColor: '#15311E',
    height: Platform.OS === 'android' ? 80 : 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  headerImage: {
    width: screenWidth * 0.8,
    height: Platform.OS === 'android' ? 80 : 85,
    resizeMode: 'contain',
    marginLeft: -10,
    marginTop: -1,
  },
  bellButton: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: '#ccc',
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderColor: '#0D2D1D',
  },
  tabText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#0D2D1D',
    fontWeight: 'bold',
  },
  documentItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: '#E8F0EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#15311E',
    fontSize: 12,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Changed to flex-start for consistent button alignment
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#15311E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8, // Added margin for spacing
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8, // Added margin for spacing
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto', // Use auto margin to push to the right
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#15311E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 48,
  },
  navText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
