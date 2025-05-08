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
  RefreshControl,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

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

export default function FacultyHome() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_review' | 'approved' | 'rejected'>('pending');
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]); // Keep all documents for filtering
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]); // State for filtered documents
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to format status text properly
  const formatStatusText = useCallback((status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, []);

  // Helper function to format classification text properly
  const formatClassificationText = useCallback((classification: string) => {
    return classification.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true); // Start loading
    console.log('Fetching documents...');
    try {
      const response = await fetch(`${API_URL}/documents/`);
      if (!response.ok) {
         const errorBody = await response.text();
         console.error('Fetch documents failed with response:', response.status, errorBody);
         try {
           const errorJson = JSON.parse(errorBody);
            throw new Error(errorJson.error || 'Failed to fetch documents');
         } catch {
            throw new Error(`Failed to fetch documents. Status: ${response.status}`);
         }
       }
      const data = await response.json();
      console.log('Documents fetched:', data.length);
      setAllDocuments(data); // Store all documents
      // Setting allDocuments will trigger the filtering useEffect
    } catch (error) {
      console.error('Error fetching documents:', error);
      let errorMessage = 'An unexpected error occurred';
       if (error instanceof Error) {
           errorMessage = error.message;
       } else if (typeof error === 'string') {
           errorMessage = error;
       }
      Alert.alert('Error', `Failed to load documents: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false); // End loading
      console.log('Fetch documents finished.');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  }, [fetchDocuments]);

  useEffect(() => {
    console.log('Initial fetch effect running...');
    fetchDocuments();
  }, [fetchDocuments]); // Dependency array includes fetchDocuments

  // Effect to filter documents whenever search query, active tab, or all documents change
  useEffect(() => {
    console.log('Filtering documents...');
    let filtered = [...allDocuments];

    // Filter by active tab
    filtered = filtered.filter(doc => doc.status === activeTab);

    // Filter by search query
    if (searchText) {
      filtered = filtered.filter(doc =>
        doc.file_name.toLowerCase().includes(searchText.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (doc.uploader_name && doc.uploader_name.toLowerCase().includes(searchText.toLowerCase())) // Added uploader name to search
      );
    }

    console.log('Filtered documents count:', filtered.length);
    setFilteredDocuments(filtered); // Update the state for the FlatList
  }, [searchText, activeTab, allDocuments]); // Dependencies for filtering

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'in_review':
        return '#FF9800';
      case 'pending':
        return '#9E9E9E';
      default:
        return '#F44336';
    }
  };

  const getActiveButtonStyle = (routeName: string) => {
    const isActive = pathname.includes(routeName);
    return {
      ...styles.navButton,
      backgroundColor: isActive ? '#1F4A2D' : 'transparent',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    };
  };

  // Render item for the FlatList
  const renderDocumentItem = useCallback(({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.file_name}</Text>
        <Text style={styles.documentSubtitle}>
          {'Uploaded on '}{new Date(item.uploaded_at).toLocaleDateString()}
        </Text>
        {/* Classifications list within the document item - using View with flexWrap */}
        {item.classifications && item.classifications.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.classifications.map((classification, index) => (
              <TouchableOpacity
                key={`${item.id}-${classification}-${index}`}
                style={styles.tagChip}
              >
                <Text style={styles.tagText}>
                  {formatClassificationText(classification)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/screen/versionhistory`)}
          >
            <Text style={styles.viewButtonText}>{'View Document'}</Text>
          </TouchableOpacity>
          <View style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {formatStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  ), [router, formatClassificationText, formatStatusText]);

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
              {formatStatusText(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#15311E" />
        ) : filteredDocuments.length === 0 ? (
          <View style={styles.noDocumentsContainer}>
            <Text style={styles.noDocumentsText}>{'No documents found.'}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={getActiveButtonStyle('home')}
          activeOpacity={0.7}
          onPress={() => router.replace({ pathname: "/(faculty)/home" })}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>{'HOME'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('search')}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: "/(faculty)/search" })}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>{'SEARCH'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('upload')}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: "/(faculty)/upload" })}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>{'UPLOAD'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('profile')}
          activeOpacity={0.7}
          onPress={() => router.replace("/(faculty)/profile")}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>{'PROFILE'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    padding: 11,
    marginRight: 5,
    marginTop: -1,
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
  contentArea: { // New style for the content area
    flex: 1, // Make it take up available space
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
  // Corrected tagsContainer style to use flexWrap
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // <--- Apply flexWrap here
    marginTop: 2,
    marginBottom: 6,
  },
  tagChip: {
    backgroundColor: '#E8F0EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4, // Added margin bottom for wrapping
  },
  tagText: {
    fontSize: 11,
    color: '#15311E',
    fontWeight: '500',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from flex-start to space-between
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#15311E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8, // Keep marginRight if you add other buttons later
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
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8, // Keep marginLeft if other action buttons are present
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  noDocumentsContainer: { // Style for the "No documents found" message container
    flex: 1, // Make it take up available space
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust as needed
  },
  noDocumentsText: { // Style for the "No documents found" text
    fontSize: 18,
    color: '#666',
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
