import React, { useEffect, useRef, useState } from 'react';
import { db, ref, set, onValue } from '../firebase';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const videoStateRef = ref(db, 'videoState');
        onValue(videoStateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log('useEffect triggered: Syncing video state from Firebase');
                console.log('Firebase data:', data);

                // Sync play/pause state
                if (data.isPlaying !== undefined && data.isPlaying !== isPlaying) {
                    setIsPlaying(data.isPlaying);

                    // Only play if the video is not playing already
                    if (data.isPlaying && videoRef.current && videoRef.current.paused) {
                        console.log('Playing video');
                        videoRef.current.play().catch((error) => {
                            console.error('Error playing video:', error);
                        });
                    } else if (!data.isPlaying && videoRef.current && !videoRef.current.paused) {
                        console.log('Pausing video');
                        videoRef.current.pause();
                    }
                }

                // Sync video current time
                if (data.currentTime !== undefined && videoRef.current.currentTime !== data.currentTime) {
                    videoRef.current.currentTime = data.currentTime;
                }
            }
        });
    }, []); // Dependency array removed

    const togglePlayPause = () => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        console.log('Toggling play/pause. New state:', newState);

        // Update Firebase state
        set(ref(db, 'videoState'), {
            isPlaying: newState,
            currentTime: videoRef.current.currentTime, // Sync current time
        }).catch((error) => {
            console.error('Error writing to Firebase:', error);
        });

        // Only trigger play/pause based on the current state
        if (newState) {
            if (videoRef.current && videoRef.current.paused) {
                console.log('Playing video');
                videoRef.current.play().catch((error) => {
                    console.error('Error playing video:', error);
                });
            }
        } else {
            if (videoRef.current && !videoRef.current.paused) {
                console.log('Pausing video');
                videoRef.current.pause();
            }
        }
    };

    // Update the time in Firebase during playback
    const handleTimeUpdate = () => {
        set(ref(db, 'videoState/currentTime'), videoRef.current.currentTime)
            .catch((error) => {
                console.error('Error updating time in Firebase:', error);
            });
        console.log('Time updated:', videoRef.current.currentTime);
    };

    // Cinematic Effects: Dim lights when video is playing
    const overlayClass = isPlaying ? 'bg-black opacity-50' : 'bg-transparent';

    return (
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-black h-screen">
            <div className={`flex items-center justify-center min-h-screen bg-gray-900 p-4 ${overlayClass}`}>
                <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-xl overflow-hidden relative">
                    <video
                        ref={videoRef}
                        onClick={togglePlayPause}
                        controls
                        className="w-full h-auto rounded-lg"
                        onTimeUpdate={handleTimeUpdate}
                    >
                        <source
                            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <style>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient-animation 5s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
        </div>
    );
};

export default VideoPlayer;
