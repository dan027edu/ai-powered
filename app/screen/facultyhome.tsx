import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
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
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
}

const FacultyHomeScreen = () => {
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
    }
  };

  useEffect(() => {
    fetchDocuments();
    // Refresh documents every 30 seconds
    const interval = setInterval(fetchDocuments, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredDocuments = documents.filter(doc => 
    doc.status === activeTab &&
    (searchText === '' || doc.file_name.toLowerCase().includes(searchText.toLowerCase()))
  );

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    viewButton: {
      backgroundColor: '#15311E',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
    },
    viewButtonText: {
      color: '#fff',
      fontWeight: '500',
    },
    statusChip: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
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
        renderItem={({ item }) => (
          <View style={styles.documentItem}>
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>{item.file_name}</Text>
              <Text style={styles.documentSubtitle}>Uploaded on {new Date(item.uploaded_at).toLocaleDateString()}</Text>
              <View style={styles.tagsContainer}>
                {item.classifications.map(classification => (
                  <View key={classification} style={styles.tagChip}>
                    <Text style={styles.tagText}>
                      {classification.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                  </View>
                ))}
              </View>
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
                <View style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>
                    {item.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navButtonContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            activeOpacity={0.7}
            onPress={() => router.replace('/(faculty)/home')}
          >
            <Icon name="home" size={24} color="#fff" />
            <Text style={styles.navText}>HOME</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navButtonContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            activeOpacity={0.7}
            onPress={() => router.push('/(faculty)/search')}
          >
            <Icon name="search" size={24} color="#fff" />
            <Text style={styles.navText}>SEARCH</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navButtonContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            activeOpacity={0.7}
            onPress={() => router.push('/(faculty)/upload')}
          >
            <Icon name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.navText}>UPLOAD</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navButtonContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            activeOpacity={0.7}
            onPress={() => router.push('/(faculty)/profile')}
          >
            <Icon name="person-outline" size={24} color="#fff" />
            <Text style={styles.navText}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FacultyHomeScreen;