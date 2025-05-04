import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const VersionHistoryScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Simple Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Version History</Text>
        <View style={styles.backButton} />
      </View>

      {/* Version History Section */}
      <View style={styles.content}>
        {/* Version Entry */}
        <View style={styles.versionCard}>
          <View style={styles.versionHeader}>
            <View style={styles.timestampContainer}>
              <Text style={styles.todayText}>Today</Text>
              <Text style={styles.timeText}>April 29, 12:34 PM</Text>
            </View>
            <Text style={styles.editorText}>Dan Benedict</Text>
          </View>
          
          <View style={styles.contentPreview}>
            <Text style={styles.previewTitle}>The Importance of Capstone Projects in Education:</Text>
            <Text style={styles.previewText} numberOfLines={3}>
              A capstone project is a culminating academic experience typically completed during the final year of a student's education. It is designed to allow students to apply their learning in a real-world or simulated context, integrating knowledge from multiple courses or disciplines...
            </Text>
          </View>
        </View>
      </View>
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
    paddingTop: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  versionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  versionHeader: {
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  todayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  editorText: {
    fontSize: 14,
    color: '#333',
  },
  contentPreview: {
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default VersionHistoryScreen;