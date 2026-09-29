import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  Platform, Linking, Image 
} from 'react-native';
import { LivePlayerNative } from './src/components/LivePlayerNative';

// Single Channel Architecture: MTC NETWORK TV
const MASTER_CHANNEL = {
  id: 'mtc-network-tv',
  name: 'MTC NETWORK TV',
  tagline: 'Your Home for Family Transformation • 24/7 Pan-African Broadcast',
  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  fallbackUrl: 'https://test-streams.mux.dev/test_001/stream.m3u8',
  currentProgram: {
    title: 'MTC Evening Studio Broadcast Live',
    presenter: 'Kwame Mensah & Ama Osei',
    description: 'Direct live studio broadcast from MTC Accra studios. Your home for family transformation.'
  },
  telemetry: {
    ingest: 'SRT 1080p59.94 Lock',
    resolution: '1080p (1920x1080)',
    viewers: '53,820 Live'
  }
};

const RADIO_STREAM = {
  id: 'mtc-radio',
  name: 'MTC Radio Live',
  tagline: '24/7 Live Audio Broadcast',
  pwaUrl: 'https://mtcradio4.webradiosite.com/pwa/#/home',
  streamUrl: 'https://servidor14-2.brlogic.com:7238/live?source=app_pwa',
  currentShow: 'Your Home for Family Transformation',
  host: 'MTC Studio Radio Host'
};

const SCHEDULE = [
  { time: '06:00 - 09:00', title: 'Africa Breakfast Daily & Morning Praise', presenter: 'Kofi Mensah & Selorm Kpodo' },
  { time: '09:00 - 12:00', title: 'Grace & Truth Live Devotional', presenter: 'Pastor Emmanuel Boakye' },
  { time: '12:00 - 14:00', title: 'Midday Africa Live Report', presenter: 'Ama Boateng' },
  { time: '14:00 - 18:00', title: 'Inspiring Communities & Culture', presenter: 'David Tagoe' },
  { time: '18:00 - 20:00', title: 'MTC Evening Studio Broadcast Live', presenter: 'Kwame Mensah & Ama Osei', isCurrent: true },
  { time: '20:00 - 22:00', title: 'Pan-African Evening Dialogue & Nightline', presenter: 'Dr. Jane Kyerematen' }
];

export default function App() {
  // Navigation tabs: LIVE TV | MTC RADIO
  const [currentTab, setCurrentTab] = useState<'TV' | 'RADIO'>('TV');
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1D2729" />

      {/* CNN / BBC Master Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('./assets/mtc-network-logo.jpg')}
              style={{ width: 42, height: 42, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,235,204,0.3)' }}
            />
            <View>
              <Text style={styles.brandTitle}>
                MTC NETWORK <Text style={{ color: '#FFEBCC' }}>TV</Text>
              </Text>
              <Text style={styles.brandSub}>YOUR HOME FOR FAMILY TRANSFORMATION</Text>
            </View>
          </View>
          <View style={styles.liveTag}>
            <Text style={styles.liveDot}>●</Text>
            <Text style={styles.liveTagText}>LIVE</Text>
          </View>
        </View>

        {/* Navigation Tabs: Strictly TV and Radio */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => setCurrentTab('TV')}
            style={[styles.navTab, currentTab === 'TV' && styles.navTabActive]}
          >
            <Text style={[styles.navTabText, currentTab === 'TV' && styles.navTabTextActive]}>
              📺 LIVE TV
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentTab('RADIO')}
            style={[styles.navTab, currentTab === 'RADIO' && styles.navTabActive]}
          >
            <Text style={[styles.navTabText, currentTab === 'RADIO' && styles.navTabTextActive]}>
              📻 MTC RADIO
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CNN Breaking News Ribbon Bar */}
      <View style={styles.breakingRibbon}>
        <View style={styles.breakingBadge}>
          <Text style={styles.breakingBadgeText}>BREAKING</Text>
        </View>
        <Text style={styles.breakingText} numberOfLines={1}>
          MTC NETWORK TV live studio transmission operational across 24 African hubs
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* =====================================================
            TAB 1: LIVE TV (CNN GO / BBC LIVE BROADCAST)
           ===================================================== */}
        {currentTab === 'TV' && (
          <View>
            {/* Master Live Television Player */}
            <View style={styles.playerWrapper}>
              <View style={styles.playerHeaderRow}>
                <Text style={styles.sectionHeader}>MASTER STUDIO TRANSMISSION</Text>
                <Text style={styles.telemetryPill}>● 1080p59.94 HD</Text>
              </View>

              <LivePlayerNative
                channelName={MASTER_CHANNEL.name}
                streamUrl={MASTER_CHANNEL.streamUrl}
                fallbackUrl={MASTER_CHANNEL.fallbackUrl}
                currentProgram={MASTER_CHANNEL.currentProgram}
              />
            </View>

            {/* Current Program Details Card */}
            <View style={styles.programCard}>
              <View style={styles.programCardHeader}>
                <Text style={styles.liveBadgeText}>ON AIR NOW</Text>
                <Text style={styles.viewersText}>👥 53,820 Viewers</Text>
              </View>
              <Text style={styles.programTitle}>{MASTER_CHANNEL.currentProgram.title}</Text>
              <Text style={styles.programPresenter}>Anchor: {MASTER_CHANNEL.currentProgram.presenter}</Text>
              <Text style={styles.programDesc}>{MASTER_CHANNEL.currentProgram.description}</Text>
            </View>

            {/* Switch to Radio Callout */}
            <TouchableOpacity 
              onPress={() => setCurrentTab('RADIO')}
              style={styles.radioCallout}
            >
              <View>
                <Text style={styles.radioCalloutTitle}>Listen to MTC Radio Live</Text>
                <Text style={styles.radioCalloutSub}>24/7 Live Audio Broadcast &amp; Gospel Devotionals</Text>
              </View>
              <View style={styles.radioCalloutBtn}>
                <Text style={styles.radioCalloutBtnText}>LISTEN ↗</Text>
              </View>
            </TouchableOpacity>

            {/* 24-Hour Broadcast Schedule for MTC-NETWORK TV */}
            <View style={styles.scheduleSection}>
              <Text style={styles.scheduleHeader}>24-HOUR BROADCAST LINEUP</Text>
              {SCHEDULE.map((item, idx) => (
                <View key={idx} style={[styles.scheduleItem, item.isCurrent && styles.scheduleItemCurrent]}>
                  <View style={styles.scheduleTimeRow}>
                    <Text style={[styles.scheduleTime, item.isCurrent && { color: '#FFEBCC' }]}>{item.time}</Text>
                    {item.isCurrent && <Text style={styles.currentBadge}>● ON AIR</Text>}
                  </View>
                  <Text style={styles.scheduleTitle}>{item.title}</Text>
                  <Text style={styles.schedulePresenter}>{item.presenter}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* =====================================================
            TAB 2: MTC RADIO
           ===================================================== */}
        {currentTab === 'RADIO' && (
          <View>
            <View style={styles.radioPlayerBox}>
              <Text style={styles.radioLiveBadge}>● LIVE AUDIO STREAM</Text>
              <Text style={styles.radioChannelTitle}>{RADIO_STREAM.name}</Text>
              <Text style={styles.radioCurrentShow}>{RADIO_STREAM.currentShow}</Text>
              <Text style={styles.radioHost}>Host: {RADIO_STREAM.host}</Text>

              {/* Audio Controls */}
              <TouchableOpacity
                onPress={() => setIsRadioPlaying(!isRadioPlaying)}
                style={styles.radioPlayButton}
              >
                <Text style={styles.radioPlayButtonText}>
                  {isRadioPlaying ? '⏸ PAUSE BROADCAST' : '▶ PLAY MTC RADIO LIVE'}
                </Text>
              </TouchableOpacity>



              <Text style={styles.radioStatusText}>
                {isRadioPlaying ? '🔊 Streaming Accra Studio Audio (128kbps AAC Stereo)' : 'Tap Play to start audio stream'}
              </Text>
            </View>

            {/* Switch back to Live TV */}
            <TouchableOpacity 
              onPress={() => setCurrentTab('TV')}
              style={[styles.radioCallout, { borderColor: '#386642' }]}
            >
              <View>
                <Text style={styles.radioCalloutTitle}>Watch MTC NETWORK TV</Text>
                <Text style={styles.radioCalloutSub}>Return to Master Live Studio HD Television Stream</Text>
              </View>
              <View style={[styles.radioCalloutBtn, { backgroundColor: '#386642' }]}>
                <Text style={[styles.radioCalloutBtnText, { color: '#FFEBCC' }]}>WATCH ↗</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Studio Pipeline & Transmission Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>MTC NETWORK TV TRANSMISSION BACKBONE</Text>
          <Text style={styles.infoText}>
            Cameras → Production Switcher → SRT Encoder → CDN → MTC App
          </Text>
          <Text style={styles.infoSubtext}>
            Studio live stream URL configured dynamically without rebuilding application.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121A1B'
  },
  header: {
    backgroundColor: '#1D2729',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(202, 222, 223, 0.15)'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#CADEDF',
    letterSpacing: 1.2
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.25)',
    borderColor: '#E50914',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4
  },
  liveDot: {
    color: '#E50914',
    fontSize: 10
  },
  liveTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800'
  },
  navRow: {
    flexDirection: 'row',
    gap: 8
  },
  navTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(202, 222, 223, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  navTabActive: {
    backgroundColor: '#386642',
    borderColor: '#FFEBCC'
  },
  navTabText: {
    color: '#CADEDF',
    fontSize: 12,
    fontWeight: '700'
  },
  navTabTextActive: {
    color: '#FFEBCC',
    fontWeight: '800'
  },
  breakingRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B91C1C',
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  breakingBadge: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8
  },
  breakingBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  breakingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  content: {
    flex: 1,
    padding: 16
  },
  playerWrapper: {
    marginBottom: 16
  },
  playerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  sectionHeader: {
    color: '#FFEBCC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  telemetryPill: {
    color: '#48BB78',
    fontSize: 10,
    fontWeight: '800'
  },
  programCard: {
    backgroundColor: '#1D2729',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(202, 222, 223, 0.12)',
    marginBottom: 16
  },
  programCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  liveBadgeText: {
    color: '#E50914',
    fontSize: 11,
    fontWeight: '800'
  },
  viewersText: {
    color: '#FFEBCC',
    fontSize: 11,
    fontWeight: '700'
  },
  programTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  programPresenter: {
    color: '#FFEBCC',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6
  },
  programDesc: {
    color: '#CADEDF',
    fontSize: 12,
    lineHeight: 17
  },
  radioCallout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172224',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 235, 204, 0.3)',
    marginBottom: 20
  },
  radioCalloutTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2
  },
  radioCalloutSub: {
    color: '#CADEDF',
    fontSize: 10
  },
  radioCalloutBtn: {
    backgroundColor: '#FFEBCC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  radioCalloutBtnText: {
    color: '#1D2729',
    fontSize: 11,
    fontWeight: '800'
  },
  scheduleSection: {
    marginBottom: 24
  },
  scheduleHeader: {
    color: '#CADEDF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  scheduleItem: {
    backgroundColor: '#1D2729',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(202, 222, 223, 0.08)'
  },
  scheduleItemCurrent: {
    borderColor: '#386642',
    backgroundColor: '#203328'
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  scheduleTime: {
    color: '#8FA2A4',
    fontSize: 11,
    fontWeight: '700'
  },
  currentBadge: {
    color: '#E50914',
    fontSize: 10,
    fontWeight: '800'
  },
  scheduleTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2
  },
  schedulePresenter: {
    color: '#CADEDF',
    fontSize: 11
  },
  radioPlayerBox: {
    backgroundColor: '#1D2729',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 235, 204, 0.25)',
    marginBottom: 20
  },
  radioLiveBadge: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10
  },
  radioChannelTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4
  },
  radioCurrentShow: {
    color: '#FFEBCC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  radioHost: {
    color: '#CADEDF',
    fontSize: 12,
    marginBottom: 20
  },
  radioPlayButton: {
    backgroundColor: '#386642',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#FFEBCC',
    marginBottom: 14
  },
  radioPlayButtonText: {
    color: '#FFEBCC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  radioStatusText: {
    color: '#CADEDF',
    fontSize: 11
  },
  infoBox: {
    backgroundColor: '#172224',
    borderWidth: 1,
    borderColor: 'rgba(255, 235, 204, 0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40
  },
  infoTitle: {
    color: '#FFEBCC',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4
  },
  infoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  infoSubtext: {
    color: '#CADEDF',
    fontSize: 11,
    lineHeight: 15
  }
});
