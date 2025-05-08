import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Changed from 'next/navigation' to 'expo-router'

const documentContent = {
  header: {
    author: 'Taglay, Dan Benedict',
  },
  content: {
    original: `GROUP MEMBERS:
DIPAS, JOHN IRAM
GERONIMO, ROLITO
GOQUINGCO, WYNETH GRACIELLA 
TAGLAY, DAN BENEDICT 


Roger is a very competent supervisor. He has been a very diligent and skillful worker. He loves his work so much and is very loyal to the company. In fact it is not uncommon to see him working 12 hours a day.

Roger believes that he is valuable to the company and contributes greatly to its productivity. He shuns having vacation thinking that it is a waste of valuable time resources. Even in company sponsored outings, he would volunteer to be part of the skeletal crew to man the operation. For most people outside Rogers section, everybody is impressed and no one denies that he could easily make it to the organizational ladder.

Because of Roger's seriousness in his job, he is hardly joins his staffs in any interaction which are not work related. Though not the silent-type, he doesn't even crack jokes let alone initiates "unofficial" conversation. Because of this hardly knows his subordinates even in not-so private level.

In most instances, he is very strict in the presence and whereabouts of his subordinates. Though apparently this is the way it should be, however, he hardly knows his subordinates or approves so reluctantly to the extent of asking them in details what they will be doing.

Naturally Roger have a career path in mind. But he never considers succession planning for his subordinates. He always gets all the training for himself but not for his subs thinking that he is always the best candidate. In fact, there has never been an instance he considers training for his subs unless elected by his superiors.

For Roger, work is work and personal thing has its place outside the workplace. No one doubts his productivity but his subs are not as enthusiastic to work with him.

In fact, they secretly rejoice his absence when he is at the meeting or training.

Questions:

What's Roger strength and weakness?
Roger's strengths are diligence, skillfulness, and dedication to the company. He works too long, often exceeds expectations, and continues making contributions to the organization's productivity. His commitment to the job and his dependability make him an important part of the company. His weaknesses are significant, however. Roger has difficulty relating to his subordinates personally and professionally and, because of that, team morale and cohesion are found to be bad. He does not invest much time in developing casual communication or teamwork events. Besides, he pays little attention to succession planning and cannot provide any subordinates with proper training since his focus is placed more on self-promotion.`,
    modified: `GROUP MEMBERS:
DIPAS, JOHN IRAM
GERONIMO, ROLITO
GOQUINGCO, WYNETH GRACIELLA 
TAGLAY, DAN BENEDICT 


Roger is a very competent supervisor. He has been a very diligent and skillful worker. He loves his work so much and is very loyal to the company. In fact it is not uncommon to see him working 12 hours a day.

Roger believes that he is valuable to the company and contributes greatly to its productivity. He shuns having vacation thinking that it is a waste of valuable time resources. Even in company sponsored outings, he would volunteer to be part of the skeletal crew to man the operation. For most people outside Rogers section, everybody is impressed and no one denies that he could easily make it to the organizational ladder.

Because of Roger's seriousness in his job, he is hardly joins his staffs in any interaction which are not work related. Though not the silent-type, he doesn't even crack jokes let alone initiates "unofficial" conversation. Because of this hardly knows his subordinates even in not-so private level.

In most instances, he is very strict in the presence and whereabouts of his subordinates. Though apparently this is the way it should be, however, he hardly knows his subordinates or approves so reluctantly to the extent of asking them in details what they will be doing.

Naturally Roger have a career path in mind. But he never considers succession planning for his subordinates. He always gets all the training for himself but not for his subs thinking that he is always the best candidate. In fact, there has never been an instance he considers training for his subs unless elected by his superiors.

For Roger, work is work and personal thing has its place outside the workplace. No one doubts his productivity but his subs are not as enthusiastic to work with him.

In fact, they secretly rejoice his absence when he is at the meeting or training.

Questions:

What's Roger strength and weakness?
Roger's strengths are diligence, skillfulness, and dedication to the company. He works too long, often exceeds expectations, and continues making contributions to the organization's productivity. His commitment to the job and his dependability make him an important part of the company. His weaknesses are significant, however. Roger has difficulty relating to his subordinates personally and professionally and, because of that, team morale and cohesion are found to be bad. He does not invest much time in developing casual communication or teamwork events. Besides, he pays little attention to succession planning and cannot provide any subordinates with proper training since his focus is placed more on self-promotion.`
  }
};

const DocumentViewerScreen = () => {
  const router = useRouter();
  const [showChanges, setShowChanges] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('100%');
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [changedLines] = useState([
    { lineNumber: 3, text: "GERONIMO, ROLITO" },
    { lineNumber: 4, text: "GOQUINGCO, WYNETH GRACIELLA" },
    { lineNumber: 10, text: "Roger is a very competent supervisor. He has been a very diligent and skillful worker. He loves his work so much and is very loyal to the company. In fact it is not uncommon to see him working 12 hours a day." },
    { lineNumber: 12, text: "Roger believes that he is valuable to the company and contributes greatly to its productivity." }
  ]);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Updates every minute

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${month} ${day}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const zoomOptions = ['50%', '60%', '70%', '80%', '90%', '100%'];

  const handleZoomChange = (zoom: string) => {
    setZoomLevel(zoom);
    setShowZoomDropdown(false);
  };

  const isLineModified = (index: number, line: string) => {
    return changedLines.some(change => change.lineNumber === index && change.text === line);
  };

  return (
    <>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Version Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.leftSection}>
            <Text style={styles.sectionLabel}>Today</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{formatDateTime(currentDateTime)}</Text>
              <View style={styles.userInfo}>
                <View style={styles.dot} />
                <Text style={styles.userName}>Dan Benedict</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.sectionLabel}>Version History</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowVersionDropdown(!showVersionDropdown)}
            >
              <Text style={styles.dropdownText}>All versions</Text>
              <MaterialIcons 
                name={showVersionDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {showVersionDropdown && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>All versions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>Named versions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setShowChanges(!showChanges)}
          >
            <View style={styles.checkbox}>
              {showChanges && <View style={styles.checkmark} />}
            </View>
            <Text style={styles.checkboxLabel}>Show Changes</Text>
          </TouchableOpacity>

          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.tabButton}>
              <MaterialIcons name="description" size={20} color="#fff" />
              <Text style={styles.buttonText}>Tab 1</Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity 
                style={styles.zoomButton}
                onPress={() => setShowZoomDropdown(!showZoomDropdown)}
              >
                <Text>{zoomLevel}</Text>
                <MaterialIcons 
                  name={showZoomDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
                  size={24} 
                  color="#000" 
                />
              </TouchableOpacity>
              
              {showZoomDropdown && (
                <View style={styles.zoomDropdown}>
                  {zoomOptions.map((zoom) => (
                    <TouchableOpacity
                      key={zoom}
                      style={styles.zoomOption}
                      onPress={() => handleZoomChange(zoom)}
                    >
                      <Text style={[
                        styles.zoomOptionText,
                        zoomLevel === zoom && styles.selectedZoomOption
                      ]}>
                        {zoom}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Document Content */}
        <ScrollView style={styles.documentContainer}>
          <View style={styles.content}>
            {documentContent.content.original.split('\n').map((line, index) => {
              const isModified = isLineModified(index, line);
              
              return (
                <View 
                  key={index}
                  style={[
                    styles.lineContainer,
                    styles.lineRow,
                    showChanges && isModified && styles.changedLine
                  ]}
                >
                  <View style={styles.textLine}>
                    <Text style={[
                      styles.documentText,
                      { fontSize: parseInt(zoomLevel) * 0.14 },
                      showChanges && isModified && styles.strikethrough
                    ]}>
                      {line}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(faculty)/home')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="home-outline" size={24} color="#fff" />
              <Text style={styles.navText}>HOME</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(faculty)/search')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="search-outline" size={24} color="#fff" />
              <Text style={styles.navText}>SEARCH</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(faculty)/upload')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.navText}>UPLOAD</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(faculty)/profile')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={24} color="#fff" />
              <Text style={styles.navText}>PROFILE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  controlsContainer: {
    backgroundColor: '#15311E',
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9998,    // Added high z-index
    elevation: 5,    // Added elevation
  },
  leftSection: {
    flex: 1,
    marginRight: 8,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    zIndex: 9999,    // Added high z-index
  },
  sectionLabel: {
    color: '#fff',
    marginBottom: 8,
  },
  dateBox: {
    backgroundColor: '#1B3D25',
    padding: 6,
    borderRadius: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  userName: {
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 9,         // Reduced from 8 to 6
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 160,        // Reduced from 180 to 160
    borderWidth: 1,
    borderColor: '#2196F3',
    zIndex: 9999,
    elevation: 6,
  },
  dropdownText: {
    color: '#666',
    fontSize: 12,      // Reduced from 13 to 12
  },
  dropdownMenu: {
    position: 'absolute',
    top: '82%',
    right: 0,
    backgroundColor: '#fff',
    width: 160,        // Reduced from 180 to 160
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9999,
    zIndex: 9999,
  },
  dropdownItem: {
    padding: 6,        // Reduced from 8 to 6
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  dropdownItemText: {
    color: '#333',
    fontSize: 12,      // Reduced from 13 to 12
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 2,
    elevation: 2,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16, // Added margin to move it right
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#15311E',
    borderRadius: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#15311E',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
    elevation: 2,
  },
  tabButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  zoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
    justifyContent: 'space-between',
  },
  documentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  documentText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#000000', // Changed to black
    paddingVertical: 2,
    fontFamily: 'Arial',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#15311E',
    height: 50,    // Changed from 60 to 50
    paddingVertical: 4, // Changed from 8 to 4
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: '#fff',
    fontSize: 10,    // Changed from 12 to 10
    marginTop: 2,    // Changed from 4 to 2
  },
  checkboxLabel: {
    color: '#000',
    fontSize: 14,
    marginLeft: 8,
  },
  zoomDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 999,
    zIndex: 999,
  },
  zoomOption: {
    padding: 8,
    minWidth: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  zoomOptionText: {
    textAlign: 'center',
    color: '#000',
  },
  selectedZoomOption: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lineContainer: {
    paddingVertical: 2,  // Reduced padding
    backgroundColor: '#ffffff',
  },
  changedLine: {
    backgroundColor: '#E3FCEF',  // Light green background
    marginHorizontal: -40,
    paddingHorizontal: 40,
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
    flexDirection: 'column',
  },
  strikethrough: {
    textDecorationLine: 'underline',
    textDecorationColor: '#4CAF50',  // Green underline
    color: '#008080',  // Teal text color
  },
  newText: {
    color: '#000000', // Changed to black
    marginTop: 4,
    textDecorationLine: 'underline', // Added underline
    textDecorationColor: '#4CAF50', // Added green underline
  },
  textLine: {
    flex: 1,
    flexDirection: 'column',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,  // Added space between paragraphs
  },
  lineNumberContainer: {
    width: 30,
    marginRight: 8,
    alignItems: 'flex-end',
  },
  lineNumber: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Arial',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletPoint: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#008080',
    marginRight: 8,
  },
});

export default DocumentViewerScreen;