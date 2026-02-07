import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Text, ScrollView, Alert } from 'react-native';
import { DownloadButton, ClearButton } from './UI/buttons';
import { FadeInView } from './UI/animations';
import { LoadingSpinner } from './UI/loading';
import { validateTikTokUrl } from './Script/function';
import { initiateDownload } from './Script/download';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleDownload = async () => {
    if (!validateTikTokUrl(url)) {
      Alert.alert('Invalid URL', 'Please enter a valid TikTok video URL.');
      return;
    }
    setLoading(true);
    const result = await initiateDownload(url);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', `Video saved to: ${result.path}`);
      if (!history.includes(url)) {
        setHistory([url, ...history.slice(0, 4)]);
      }
      setUrl('');
    } else {
      Alert.alert('Download Failed', result.message);
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FadeInView style={styles.header}>
        <Text style={styles.title}>FavTok</Text>
        <Text style={styles.subtitle}>Save Your Favorite TikTok Videos</Text>
      </FadeInView>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Paste TikTok video link here..."
          placeholderTextColor="#999"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.buttonRow}>
          <ClearButton onPress={handleClear} disabled={loading || url.length === 0} />
          <DownloadButton onPress={handleDownload} disabled={loading || url.length === 0} />
        </View>
      </View>

      {loading && <LoadingSpinner />}

      {history.length > 0 && (
        <FadeInView style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Downloads</Text>
            <ClearButton onPress={handleClearHistory} label="Clear" size="small" />
          </View>
          <ScrollView>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyUrl} numberOfLines={1}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </FadeInView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#69c9d0',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  inputSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#69c9d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  input: {
    backgroundColor: '#252525',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historySection: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f1f1',
  },
  historyItem: {
    backgroundColor: '#252525',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyUrl: {
    color: '#69c9d0',
    fontSize: 14,
  },
});