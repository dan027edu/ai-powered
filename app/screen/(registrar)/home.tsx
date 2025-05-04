import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  classifications: string[];
  description: string;
  uploader_name: string;
  status: string;
  file_id: string;
}

const RegistrarHomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_review' | 'approved' | 'rejected'>('pending');
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://192.168.1.7:8000/api/documents/');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to fetch documents');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = doc.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const handleApproveDocument = async (documentId: string) => {
    try {
      await fetch(`http://192.168.1.7:8000/api/documents/${documentId}/approve/`, {
        method: 'POST',
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error approving document:', error);
      Alert.alert('Error', 'Failed to approve document');
    }
  };

  const handleRejectDocument = async (documentId: string) => {
    try {
      await fetch(`http://192.168.1.7:8000/api/documents/${documentId}/reject/`, {
        method: 'POST',
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting document:', error);
      Alert.alert('Error', 'Failed to reject document');
    }
  };

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.file_name}</Text>
        <Text style={styles.documentSubtitle}>{item.description}</Text>
        <Text style={styles.documentSubtitle}>Submitted: {new Date(item.uploaded_at).toLocaleDateString()}</Text>
        
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push({
              pathname: "/screen/documentviewer/[id]",
              params: { id: item.file_id }
            })}
          >
            <Text style={styles.viewButtonText}>View Document</Text>
          </TouchableOpacity>
          
          {activeTab === 'pending' && (
            <>
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
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../assets/images/udmaddress.png')}
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
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.replace('/screen/(registrar)/home')}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/screen/(registrar)/search')}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/screen/(registrar)/upload')}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/screen/profile')}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#15311E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
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
    marginRight: 8,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#15311E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 5,
  },
  navText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});