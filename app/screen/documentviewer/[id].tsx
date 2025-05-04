import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const DocumentViewerScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const mockDocument = {
    title: "Sample Document",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

This is a sample document content for demonstration purposes. In a real implementation, this would be the actual document content loaded from your backend.

The document preview would support various formats like PDF, DOCX, and images.`,
    date: new Date().toLocaleDateString(),
    type: "Text Document"
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Viewer</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>{mockDocument.title}</Text>
          <Text style={styles.documentMeta}>
            Type: {mockDocument.type} • Added: {mockDocument.date}
          </Text>
        </View>
        
        <View style={styles.documentContent}>
          <Text style={styles.contentText}>{mockDocument.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
  },
  header: {
    backgroundColor: '#15311E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  documentHeader: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  documentMeta: {
    fontSize: 14,
    color: '#666',
  },
  documentContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default DocumentViewerScreen;