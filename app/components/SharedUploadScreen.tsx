import React, { useState } from 'react';
import { Platform, ScrollView, Switch, Alert, ActivityIndicator, StatusBar, StyleSheet } from 'react-native'; // Import StyleSheet
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useRouter, usePathname } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

// --- Moved styles definition to the top ---
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
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#000',
    ...Platform.select({
      android: {
        color: '#000',
      },
      ios: {
        color: '#000',
      }
    }),
  },
  ocrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#15311E',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedFileName: {
    marginBottom: 10,
    color: '#666',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#15311E',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
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
// --- End of styles definition ---


const API_URL = 'http://159.223.53.201/api'; // Update this to your DigitalOcean Droplet's public IP address

interface SharedUploadScreenProps {
  onUploadSuccess?: () => void;
  redirectPath?: '/(faculty)/home' | '/(registrar)/home';
  apiUrl: string;
}

interface SelectedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

// Changed to default export
const SharedUploadScreen: React.FC<SharedUploadScreenProps> = ({
  onUploadSuccess,
  redirectPath = '/(faculty)/home',
  apiUrl
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Update user type detection to handle all routing scenarios
  const isRegistrar = redirectPath.includes('/(registrar)') || pathname.includes('/(registrar)') || pathname.includes('/screen/(registrar)');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [enableOcr, setEnableOcr] = useState(true);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword',
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType
        });
        if (!description) {
          setDescription(asset.name);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    if (!firstName || !lastName || !email || !selectedPurpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    console.log('Starting upload...'); // Log start of upload

    try {
      const formData = new FormData();
      const fileToUpload = {
        uri: Platform.OS === 'ios' ? selectedFile.uri.replace('file://', '') : selectedFile.uri,
        type: selectedFile.mimeType || 'application/octet-stream',
        name: selectedFile.name
      };

      // @ts-ignore
      formData.append('file', fileToUpload);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('purpose', selectedPurpose);
      formData.append('description', description);
      formData.append('enable_ocr', enableOcr.toString());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timed out after 5 minutes'); // Log timeout
        controller.abort();
      }, 300000); // 5 minute timeout

      console.log('Sending POST request to:', `${apiUrl}/documents/process/`); // Log endpoint

      const response = await fetch(`${apiUrl}/documents/process/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data', // fetch sets this automatically with FormData
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Request completed.'); // Log request completion

      // --- Add these logging lines ---
      console.log('Backend Response Status:', response.status);
      const responseText = await response.text(); // Read response body as text
      console.log('Backend Response Body:', responseText);
      // --- End logging lines ---

      // Now, attempt to parse as JSON (handle potential errors if not JSON)
      let result;
      try {
          result = JSON.parse(responseText); // Parse the text as JSON
          console.log('Response parsed as JSON:', result); // Log parsed result
      } catch (jsonError) {
          console.error('Failed to parse response as JSON:', jsonError);
          console.log('Raw response text:', responseText); // Log raw text if JSON parsing fails
          // If JSON parsing fails, the response body is likely not the expected JSON error format
          throw new Error(`Invalid response from backend. Status: ${response.status}. Body: ${responseText.substring(0, 100)}...`); // Include status and partial body
      }


      if (!response.ok) { // Check if the response status is not in the 2xx range
          console.error('Backend returned an error status:', response.status, result);
          // Handle the error based on the status and result body
          const errorMessage = result && result.error ? result.error : 'Unknown backend error';
          throw new Error(`Upload failed: ${errorMessage}`);
      }

      // ... rest of the success handling (if response.ok is true)
      console.log('Upload successful:', result);

      const classifications = result.classifications.map((c: string) =>
        c.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      ).join(' + ');

      // Clear form data first
      setSelectedFile(null);
      setFirstName('');
      setLastName('');
      setEmail('');
      setSelectedPurpose('');
      setDescription('');

      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Show success message and navigate
      Alert.alert(
        'Success',
        `Document processed successfully!\nClassification: ${classifications}`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.push(redirectPath);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timed out. Please check your internet connection and try again.';
        } else {
          // Use the error message from the thrown Error (which includes backend error if available)
          errorMessage = error.message;
        }
      }

      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
      console.log('Upload process finished.'); // Log end of process
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
          onPress={() => router.push("../screen/notification")}
        >
          <Icon name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Name row to save vertical space */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
            </View>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Purpose</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPurpose}
              onValueChange={setSelectedPurpose}
              style={styles.picker}
            >
              <Picker.Item label="Select purpose" value="" />
              <Picker.Item label="Employment" value="employment" />
              <Picker.Item label="Further Studies" value="further_studies" />
              <Picker.Item label="Board Exam" value="board_exam" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={3}
          />

          <View style={styles.ocrContainer}>
            <Text style={styles.label}>Enable OCR</Text>
            <Switch
              value={enableOcr}
              onValueChange={setEnableOcr}
              trackColor={{ false: '#767577', true: '#15311E' }}
            />
          </View>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickDocument}
          >
            <Text style={styles.uploadButtonText}>
              {selectedFile ? 'Change File' : 'Select File'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <Text style={styles.selectedFileName}>
              Selected: {selectedFile.name}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isUploading && styles.disabledButton]}
            onPress={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

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
          onPress={() => router.replace(isRegistrar ? '/(registrar)/profile' : '/(faculty)/profile')}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SharedUploadScreen; // Changed to default export
