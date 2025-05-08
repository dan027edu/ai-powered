import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// Update this to your DigitalOcean Droplet's public IP address
const API_URL = 'http://159.223.53.201/api';

// Type definitions
interface Document {
  id: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  classifications: string[];
  description: string;
  uploader_name: string;
  // Assuming status and file_id might also be relevant for search results or future use
  status?: 'pending' | 'in_review' | 'approved' | 'rejected';
  file_id?: string;
}

interface Props {
  isRegistrar?: boolean;
}

// Updated DocumentItem to use View with flexWrap for classifications
const DocumentItem = memo(({ item, onClassificationPress }: { item: Document, onClassificationPress: (tag: string) => void }) => (
  <View style={styles.documentItem}>
    <View style={styles.documentIcon}>
      <Icon name="document-outline" size={24} color="#666" />
    </View>
    <View style={styles.documentContent}>
      <Text style={styles.documentTitle} numberOfLines={1}>{item.file_name}</Text>
      {item.uploader_name && <Text style={styles.uploader} numberOfLines={1}>Uploaded by: {item.uploader_name}</Text>}
      {item.description && <Text style={styles.documentSubtitle} numberOfLines={2}>{item.description}</Text>}
      {item.classifications && item.classifications.length > 0 && (
        // Render classifications directly in a View with flexWrap
        <View style={styles.tagsContainer}>
          {item.classifications.map((classification, index) => (
            <TouchableOpacity
              key={`${item.id}-${classification}-${index}`} // Use a compound key for safety
              style={styles.tagChip}
              // onPress={() => handleClassificationPress(tag)} // Uncomment if you have a handler for tag press
            >
              <Text style={styles.tagText}>
                {classification.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  </View>
));

const SharedSearchScreen: React.FC<Props> = ({ isRegistrar = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [uniqueClassifications, setUniqueClassifications] = useState<string[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Use the updated API_URL here
      const response = await fetch(`${API_URL}/documents/`);
      if (!response.ok) {
        // Attempt to read error from response body if available
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
      setAllDocuments(data);
      setDocuments(data);

      // Extract unique classifications
      const classifications = new Set<string>();
      data.forEach((doc: Document) => {
        if (doc.classifications) { // Ensure classifications array exists
           doc.classifications.forEach(c => classifications.add(c));
        }
      });
      setUniqueClassifications(Array.from(classifications));
    } catch (error) {
      console.error('Error fetching documents:', error);
      let errorMessage = 'An unexpected error occurred';
       if (error instanceof Error) {
           errorMessage = error.message;
       } else if (typeof error === 'string') {
           errorMessage = error;
       }
      Alert.alert(
        'Error',
        `Unable to fetch documents: ${errorMessage}. Please check your connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let filtered = [...allDocuments];

    if (selectedClassification) {
      filtered = filtered.filter(doc =>
         doc.classifications && doc.classifications.includes(selectedClassification) // Ensure classifications array exists
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.uploader_name && doc.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) // Added uploader name to search
      );
    }

    setDocuments(filtered);
  }, [searchQuery, selectedClassification, allDocuments]);

  const handleClassificationPress = useCallback((classification: string) => {
    setSelectedClassification(prev => prev === classification ? null : classification);
  }, []);

  const renderClassificationChip = (classification: string) => (
    <TouchableOpacity
      key={classification}
      style={[
        styles.classificationChip,
        selectedClassification === classification && styles.selectedChip
      ]}
      onPress={() => handleClassificationPress(classification)}
    >
      <Text style={[
        styles.classificationText,
        selectedClassification === classification && styles.selectedChipText
      ]}>
        {classification.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Text>
    </TouchableOpacity>
  );

  // Removed getItemLayout as it's problematic with variable item heights
  // const getItemLayout = useCallback((data: Document[] | null | undefined, index: number) => ({
  //   length: 120, // Approximate height of each item - adjust if needed
  //   offset: 120 * index,
  //   index,
  // }), []);

  const renderItem = useCallback(({ item }: { item: Document }) => (
    // Pass item.id or file_id if you want to navigate to a detail screen
    <DocumentItem item={item} onClassificationPress={handleClassificationPress} />
  ), [handleClassificationPress]);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/udmaddress.png')}
          style={styles.headerImage}
        />
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push(isRegistrar ? '/screen/notification' : '/screen/notification')} // Adjust notification path based on role if needed
        >
          <Icon name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Classifications Filter Chips */}
      {uniqueClassifications.length > 0 && (
        <View style={styles.classificationsContainer}>
          <FlatList
            data={uniqueClassifications}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(classification) => classification} // Classification tags themselves should be unique
            renderItem={({ item: classification }) => renderClassificationChip(classification)}
            contentContainerStyle={{ paddingRight: 16 }} // Add some padding at the end
          />
        </View>
      )}


      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#15311E" />
      ) : (
         documents.length === 0 ? (
            <View style={styles.noDocumentsContainer}>
                <Text style={styles.noDocumentsText}>No documents found.</Text>
            </View>
         ) : (
            <FlatList
              data={documents}
              renderItem={renderItem}
              // Explicitly convert id to string for the keyExtractor
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              // Removed getItemLayout prop
              // getItemLayout={getItemLayout}
              // Performance optimizations (can be adjusted based on testing)
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              windowSize={5}
              initialNumToRender={7}
            />
         )
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={getActiveButtonStyle('home')}
          activeOpacity={0.7}
          onPress={() => router.replace(isRegistrar ? '/(registrar)/home' : '/(faculty)/home')}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('search')}
          activeOpacity={0.7}
          onPress={() => router.push(isRegistrar ? '/(registrar)/search' : '/(faculty)/search')}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('upload')}
          activeOpacity={0.7}
          onPress={() => router.push(isRegistrar ? '/(registrar)/upload' : '/(faculty)/upload')}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('profile')}
          activeOpacity={0.7}
          onPress={() => router.replace(isRegistrar ? '/(registrar)/profile' : '/(faculty)/profile')} // Corrected navigation path for registrar profile
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
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#000',
    fontSize: 14,
  },
  classificationsContainer: {
    height: 50, // Fixed height for the horizontal FlatList
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  classificationChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginVertical: 6, // Added vertical margin for spacing in the horizontal list
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedChip: {
    backgroundColor: '#15311E',
  },
  classificationText: {
    color: '#666',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#fff',
  },
  documentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  documentIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  documentContent: {
    flex: 1,
    paddingRight: 4,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  uploader: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // <--- This style is now correctly applied to a View
    marginTop: 2, // Adjusted margin top
    marginBottom: 6, // Adjusted margin bottom
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
  noDocumentsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50, // Adjust as needed
  },
  noDocumentsText: {
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

export default SharedSearchScreen;
