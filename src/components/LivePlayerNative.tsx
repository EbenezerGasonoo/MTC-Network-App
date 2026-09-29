import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ActivityIndicator, Dimensions, Platform 
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

interface LivePlayerNativeProps {
  channelName: string;
  streamUrl: string;
  fallbackUrl?: string;
  currentProgram: {
    title: string;
    presenter?: string;
    description?: string;
    nextProgram?: string;
  };
  onSwitchChannel?: (channelId: string) => void;
}

export const LivePlayerNative: React.FC<LivePlayerNativeProps> = ({
  channelName,
  streamUrl,
  fallbackUrl,
  currentProgram
}) => {
  const videoRef = useRef<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeUrl, setActiveUrl] = useState<string>(streamUrl);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    setActiveUrl(streamUrl);
    setIsFallback(false);
    setHasError(false);
  }, [streamUrl]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.warn(`[MTC Mobile Player Error] ${status.error}`);
        setHasError(true);
        // Switch to fallback
        if (fallbackUrl && !isFallback) {
          setIsFallback(true);
          setActiveUrl(fallbackUrl);
        }
      }
    } else {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      if (status.isPlaying) {
        setHasError(false);
      }
    }
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const toggleMute = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      {/* Native Video Surface */}
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: activeUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
        isMuted={isMuted}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <View style={styles.centerOverlay}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.bufferingText}>Connecting to MTC Network...</Text>
          <Text style={styles.bufferingSubtext}>Acquiring studio live stream</Text>
        </View>
      )}

      {/* Disconnect / Fallback Banner */}
      {isFallback && (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>⚠️ EMERGENCY BACKUP FEED ACTIVE</Text>
        </View>
      )}

      {/* Top Header Overlay: Channel & ● LIVE */}
      <View style={styles.topBar}>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>● LIVE</Text>
        </View>
        <Text style={styles.channelText}>{channelName}</Text>
      </View>

      {/* Bottom Controls Overlay */}
      <View style={styles.bottomBar}>
        <View style={styles.programInfo}>
          <Text style={styles.programTitle}>{currentProgram.title}</Text>
          {currentProgram.presenter && (
            <Text style={styles.presenterText}>with {currentProgram.presenter}</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={togglePlay} style={styles.controlButton}>
            <Text style={styles.btnText}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
            <Text style={styles.btnText}>{isMuted ? 'UNMUTE' : 'MUTE'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => videoRef.current?.presentFullscreenPlayer()} 
            style={[styles.controlButton, styles.goldButton]}
          >
            <Text style={[styles.btnText, { color: '#07090E', fontWeight: '800' }]}>FULLSCREEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1
  },
  video: {
    width: '100%',
    height: '100%'
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 9, 14, 0.75)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bufferingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12
  },
  bufferingSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4
  },
  fallbackBanner: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    zIndex: 10
  },
  fallbackText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800'
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10, 13, 20, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(229, 9, 20, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E50914'
  },
  liveText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800'
  },
  channelText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(7, 9, 14, 0.85)'
  },
  programInfo: {
    marginBottom: 8
  },
  programTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800'
  },
  presenterText: {
    color: '#F5A623',
    fontSize: 11,
    fontWeight: '600'
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  goldButton: {
    backgroundColor: '#F5A623'
  },
  btnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700'
  }
});
