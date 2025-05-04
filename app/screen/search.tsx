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

// Type definitions
interface Document {
  id: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  classifications: string[];
  description: string;
  uploader_name: string;
}

const SearchScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [uniqueClassifications, setUniqueClassifications] = useState<string[]>([]);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]); // Store all documents

  // Fetch documents from the backend
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.7:8000/api/documents/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
      setAllDocuments(data);
      setDocuments(data);
      
      // Extract unique classifications
      const classifications = new Set<string>();
      data.forEach((doc: Document) => {
        doc.classifications.forEach(c => classifications.add(c));
      });
      setUniqueClassifications(Array.from(classifications));
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert(
        'Error',
        'Unable to fetch documents. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents based on search query and selected classification
  useEffect(() => {
    let filtered = [...allDocuments];
    
    // Apply classification filter
    if (selectedClassification) {
      filtered = filtered.filter(doc => 
        doc.classifications.includes(selectedClassification)
      );
    }
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setDocuments(filtered);
  }, [searchQuery, selectedClassification, allDocuments]);

  const handleClassificationPress = (classification: string) => {
    setSelectedClassification(prev => 
      prev === classification ? null : classification
    );
  };

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

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentIcon}>
        <Icon 
          name={getDocumentIcon(item.file_type)} 
          size={24} 
          color="#666"
        />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.file_name}</Text>
        <Text style={styles.documentSubtitle}>
          Uploaded by {item.uploader_name}
        </Text>
        <View style={styles.tagsContainer}>
          {item.classifications.map(classification => (
            <TouchableOpacity
              key={classification}
              style={styles.tagChip}
              onPress={() => handleClassificationPress(classification)}
            >
              <Text style={styles.tagText}>
                {classification.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const getDocumentIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'document-text-outline';
      case 'docx':
      case 'doc':
        return 'document-outline';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image-outline';
      default:
        return 'document-outline';
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
    classificationChip: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
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
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: '#fff',
    },
    documentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
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
    navButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
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
    categoriesContainer: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      backgroundColor: '#fff',
    },
    noClassificationsText: {
      color: '#666',
      fontSize: 14,
      marginLeft: 16,
    },
  });

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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Classifications Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uniqueClassifications && uniqueClassifications.length > 0 ? (
            uniqueClassifications.map(classification => 
              renderClassificationChip(classification)
            )
          ) : (
            <Text style={styles.noClassificationsText}>No classifications found</Text>
          )}
        </ScrollView>
      </View>

      {/* Document List */}
      {loading ? (
        <ActivityIndicator size="large" color="#15311E" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={getActiveButtonStyle('home')} 
          activeOpacity={0.7}
          onPress={() => router.replace('/screen/facultyhome')}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('search')} 
          activeOpacity={0.7}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('upload')} 
          activeOpacity={0.7}
          onPress={() => router.push('/screen/upload')}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('profile')} 
          activeOpacity={0.7}
          onPress={() => router.push('/screen/profile')}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;